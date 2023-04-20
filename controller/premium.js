const Razorpay = require('razorpay');
const Order = require('../model/orders')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const purchasepremium = async (req, res) => {
    try{
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({order, key_id : rzp.key_id});
            }).catch(err => {
                console.log(err);
                return res.status(500).json({ message: "Failed to create order in database" });
            })
        })
    }catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const updateTransactionStatus = async(req, res) => {
    try{
        const {payment_id, order_id} = req.body;
        console.log(payment_id, order_id);
        const order = await Order.findOne({where: {orderid : order_id}});
        if(!order) {
            req.user.update({status: 'FAILED'});
            return res.status(404).json({success: false, message: "Order Not Found"});
        }
        const updatePaymentId = req.user.update({paymentid : payment_id, status: 'SUCCESSFUL'});
        const updatePremiumUser = req.user.update({ispremiumuser : true});
        await Promise.all([updatePaymentId, updatePremiumUser]).then(result => {
            return res.status(202).json({sucess: true, message: "Transaction Successful"})
        })
        .catch(err => console.log(err));
    }catch(err) {
        console.log(err);
    }
    // try{
    //     const {payment_id, order_id} = req.body;
    //     Order.findOne({where: {orderid : order_id}}).then(order => {
    //         req.user.update({paymentid : payment_id, status: 'SUCCESSFUL'}).then(() => {
    //             req.user.update({ispremiumuser : true}).then(() => {
    //                 return res.status(202).json({sucess: true, message: "Transaction Successful"});
    //             }).catch((err) => {
    //                 throw new Error(err);
    //             })
    //         }).catch(err => {
    //             throw new Error(err);
    //         })
    //     }).catch(err => {
    //         throw new Error(err);
    //     })
    // }catch(err) {
    //     console.log(err);
    // }
}
module.exports = {
    purchasepremium,
    updateTransactionStatus
};