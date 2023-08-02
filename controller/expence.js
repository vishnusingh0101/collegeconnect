const Expence = require('../model/expence');
const User = require('../model/user');
const mongoose = require('mongoose');
const Userservices = require('../services/userservices');
const S3services = require('../services/S3services');
const Report = require('../model/report');
const date = new Date();


const downloadexpence = async (req, res, next) => {
    try {
        const curdate = date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear();
        const expences = await Expence.find({userId: req.user._id});
        const stringifedExpence = JSON.stringify(expences);
        const userName = req.user.name;
        const filename = `Expence_${userName} / ${new Date()}.txt`;
        const fileURL = await S3services.uploadToS3(stringifedExpence, filename);
        const repo = new Report({ link: fileURL, userId: req.user.id, createdAt: curdate });
        repo.save();
        res.status(200).json({ fileURL, success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ fileURL: '', success: false, error: err });
    }
}

// control to fetch all the expence details from database
const getexpences = async (req, res, next) => {
    const userId = req.user.id;
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +req.query.items;
    let totalItems;
    try {
        totalItems = await Expence.count({ userId });
        const expences = await Expence.find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        res.status(200).json({
            expences,
            success: true,
            pagedata: {
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                nextPage: page + 1,
                hasPreviousPage: page > 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'server error', status: false })
    }

}

// control to save any expence detail in database
const addExpence = async (req, res, next) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        const amount = parseInt(req.body.amount);
        user.totalExpence += amount;
        user.save().then(result => {
            const expence = new Expence({
                amount: req.body.amount,
                description: req.body.description,
                category: req.body.category,
                userId: req.user.id,
            });
            expence.save()
            .then(result=>{
                res.status(200).json({ newExpence: result, status: true });
            })
        })
    } catch (err) {
        res.status(500).json({ error: err, status: false, message: 'server error' });
    };
}

const postEditExpence = async (req, res, next) => {
    const expId = req.body.id;
    const amount = parseInt(req.body.amount);
    const description = req.body.description;
    const category = req.body.category;
    const userId = req.user.id;
    const expence = Expence.find({ userId: userId, _id: expId });
    const user = User.findById({ _id: userId });
    await Promise.all([expence, user])
        .then(async ([expences, user]) => {
            const expence = expences[0];
            user.totalExpence = (user.totalExpence - expence.amount) + amount;
            user.save()
                .then(() => {
                    expence.amount = amount;
                    expence.description = description;
                    expence.category = category;
                    return expence.save();
                })
        })
        .then(result => {
            console.log(result);
            res.status(200).json({ newExpence: result, message: 'Updated Successfully', status: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'some error', error: err, status: false });
        });

};

// control to delete any expence detail
const deleteExpence = async (req, res, next) => {
    // const t = await sequelize.transaction();
    const session = await mongoose.startSession();
    session.startTransaction();

    const expenceId = req.params.id;
    const amount = parseInt(req.params.amount);
    const userId = req.user.id;
    try {
        const expence = Expence.findByIdAndRemove({userId, _id: expenceId});
        const user = User.findById({_id:userId});
        await Promise.all([expence, user])
            .then(async ([expence, user]) => {
                user.totalExpence -= amount;  
                user.save();
                res.status(200).json({ message: 'Successfully deleted', status: true });
                await session.commitTransaction();
                session.endSession();
            })
    } catch (err) {
        console.log(err);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Try again', status: false });
    }
}

module.exports = {
    downloadexpence,
    getexpences,
    addExpence,
    postEditExpence,
    deleteExpence
}

