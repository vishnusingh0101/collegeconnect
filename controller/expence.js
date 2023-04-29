const Expence = require('../model/expence');
const User = require('../model/user');
const sequelize = require('../util/database');
const Userservices = require('../services/userservices');
const S3services = require('../services/S3services');
const Report = require('../model/report');



const downloadexpence = async (req, res, next) => {
    try{
    const expences = await Userservices.getExpences(req);
    const stringifedExpence = JSON.stringify(expences);
    const userName = req.user.name;
    const filename = `Expence_${userName} / ${new Date()}.txt`;
    const fileURL = await S3services.uploadToS3(stringifedExpence, filename);
    await Report.create({link: fileURL, userId: req.user.id});
    res.status(200).json({ fileURL, success: true });
    }catch(err) {
        console.log(err);
        res.status(500).json({fileURL:'', success: false, error: err});

    }
}

// control to fetch all the expence details from database
const getexpences = (req, res, next) => {
    req.user.getExpences().then(expence => {
        return res.status(200).json({ expence, success: true });
    })
        .catch(err => {
            return res.status(402).json({ error: err, success: false });
        })
}

// control to save any expence detail in database
const addExpence = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const user = await User.findByPk(req.user.id, { transaction: t });
        console.log('User found:', user);
        await user.update({
            totalExpence: sequelize.literal('`totalExpence` + ' + req.body.amount)
        });
        const data = await Expence.create({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category,
            userId: req.user.id,
        }, { transaction: t });

        await t.commit();
        res.status(200).json({ newExpence: data });
    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: err });
    };
}

const postEditExpence = async (req, res, next) => {
    const t = await sequelize.transaction();
    const expId = req.body.id;
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const uid = req.user.id;
    console.log(expId, amount, description, category);
    const expence = Expence.findOne({ where: { userId: uid, id: expId } }, { transaction: t });
    const user = User.findByPk(uid, { transaction: t });
    await Promise.all([expence, user])
        .then(async ([expence, user]) => {
            await user.update({
                totalExpence: sequelize.literal('`totalExpence` - ' + expence.amount)
            });
            await user.update({
                totalExpence: sequelize.literal('`totalExpence` + ' + amount)
            });
            expence.amount = amount;
            expence.description = description;
            expence.category = category;
            res.status(200).json({ newExpence: expence.dataValues });
            return expence.save();
        })
        .then(result => {
            t.commit();
            console.log('updatedProduct');
        })
        .catch(err => {
            console.log(err)
            t.rollback();
        });
};

// control to delete any expence detail
const deleteExpence = async (req, res, next) => {
    const t = await sequelize.transaction();
    const eId = req.params.id;
    const amount = req.params.amount;
    const uid = req.user.id;
    try {
        const expence = Expence.destroy({ where: { userId: uid, id: eId } }, { transaction: t });
        const user = User.findByPk(uid);
        await Promise.all([expence, user])
            .then(async ([expence, user]) => {
                console.log(expence);
                console.log('delete successs');
                await user.update({
                    totalExpence: sequelize.literal('`totalExpence` - ' + amount)
                });
                res.sendStatus(200);
                t.commit();
            })
    } catch (err) {
        t.rollback();
        console.log(err);
    }
}

module.exports = {
    downloadexpence,
    getexpences,
    addExpence,
    postEditExpence,
    deleteExpence

}

