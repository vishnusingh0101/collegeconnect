const Razorpay = require('razorpay');
const Order = require('../model/orders');
const User = require('../model/user');
const Report = require('../model/report');
require('dotenv').config();

const purchasepremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                console.log(err);
                throw new Error(JSON.stringify(err));
            }
            // req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(() => {
            //     return res.status(201).json({ order, key_id: rzp.key_id });
            // })
            const neworder = new Order({ orderid: order.id, status: 'PENDING', paymentid: null });
            neworder.save()
                .then(result => {
                    console.log(result);
                    return res.status(201).json({ order, key_id: rzp.key_id });
                })
                .catch(err => {
                    console.log('got hit err');
                    console.log(err);
                    return res.status(500).json({ message: "Failed to create order in database" });
                })
        })
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ orderid: order_id });
        console.log(order);

        if (!order) {
            order.status = 'FAILED';
            await order.save();
            return res.status(404).json({ success: false, message: "Order Not Found" });
        }

        order.paymentid = payment_id;
        order.status = 'SUCCESSFUL';
        await order.save();

        const user = await User.findById(req.user._id);
        user.ispremiumuser = true;
        await user.save();

        return res.status(202).json({ success: true, message: "Transaction Successful" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong", success: false });
    }
};

const ispremium = async (req, res, next) => {
    const userId = req.user.id;
    await User.findOne({ _id: userId })
        .then(user => {
            console.log(user.ispremiumuser);
            res.json({ ispremium: user.ispremiumuser })
        })
        .catch(err => {
            return res.status(500).json({ error: err, status: false });
        });
}


const leaderBord = async (req, res, next) => {
    try {
        const leaderborddata = await User.find()
        .sort({'totalExpence': -1});
        res.status(200).json({ leaderborddata });
    } catch (err) {
        res.status(500).json(err);
    }
}

const report = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const downloadedReport = await Report.find({userId: userId})
        .select("link createdAt")
        .sort({'createdAt': 1});
            // {
            // where: { userId },
            // attributes: ['link', 'createdAt'],
            // order: [['createdAt', 'ASC']]}
        res.status(200).json({ downloadedReport });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}


module.exports = {
    purchasepremium,
    updateTransactionStatus,
    leaderBord,
    ispremium,
    report
};