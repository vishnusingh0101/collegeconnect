const Razorpay = require('razorpay');
const Order = require('../model/orders');
const User = require('../model/user');
const Expence = require('../model/expence');
const sequelize = require('../util/database');
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
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            }).catch(err => {
                console.log(err);
                return res.status(500).json({ message: "Failed to create order in database" });
            })
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        console.log(payment_id, order_id);
        const order = await Order.findOne({ where: { orderid: order_id } });
        console.log('order ' + order);
        if (!order) {
            req.user.update({ status: 'FAILED' });
            return res.status(404).json({ success: false, message: "Order Not Found" });
        }
        const updatePaymentId = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
        const updatePremiumUser = req.user.update({ ispremiumuser: true });
        await Promise.all([updatePaymentId, updatePremiumUser]).then(result => {
            return res.status(202).json({ sucess: true, message: "Transaction Successful" })
        })
            .catch(err => console.log(err));
    } catch (err) {
        console.log(err);
    }
}

const ispremium = async (req, res, next) => {
    const userId = req.user.id;
    User.findOne({ where: { id: userId } })
        .then(user => {
            res.json({ premium: user.ispremiumuser })
        })
        .catch(err => console.log(err));
}


const leaderBord = (req, res, next) => {
    User.findAll()
        .then(user => {
            const userData = user.map(({ name, totalExpence }) => ({ name, totalExpence }));
            res.json(userData);
        })
        .catch(err => console.log(err));
}


module.exports = {
    purchasepremium,
    updateTransactionStatus,
    leaderBord,
    ispremium
};