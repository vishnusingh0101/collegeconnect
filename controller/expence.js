const Expence = require('../model/expence');
const User = require('../model/user');
const sequelize = require('../util/database');


// control to fetch all the expence details from database
exports.getAllExpence = (req, res, next) => {
    const id = req.user.id;
    Expence.findAll({ where: { userId: id } })
        .then(expence => {
            res.json(expence);
        })
        .catch(err => console.log(err));
}

// control to save any expence detail in database
exports.addExpence = async (req, res, next) => {

    try {
        const data = await Expence.create({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category,
            userId: req.user.id,
        });
        res.status(200).json({ newExpence: data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    };
    try {
        const user = await User.findByPk(req.user.id);
        console.log('User found:', user);
        await user.update({
            totalExpence: sequelize.literal('`totalExpence` + ' + req.body.amount)
        });
    } catch (err) {
        console.log(err);
    };
}

exports.postEditExpence = async (req, res, next) => {
    const expId = req.body.id;
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const uid = req.user.id;
    console.log(expId, amount, description, category);
    const expence = Expence.findOne({ where: { userId: uid, id: expId } });
    const user = User.findByPk(uid);
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
            console.log('updatedProduct');
        })
        .catch(err => console.log(err));
};

// control to delete any expence detail
exports.deleteExpence = async (req, res, next) => {
    const eId = req.params.id;
    const amount = req.params.amount;
    const uid = req.user.id;
    try{ 
            const expence = Expence.destroy({ where: { userId: uid, id: eId } });
            const user = User.findByPk(uid);
            await Promise.all( [expence, user])
            .then(async ([expence, user]) => {
                console.log(expence);
                console.log('delete successs');
                await user.update({
                    totalExpence: sequelize.literal('`totalExpence` - ' + amount)
                });
                res.sendStatus(200);
            })
    }catch(err){
        console.log(err);
    }
}