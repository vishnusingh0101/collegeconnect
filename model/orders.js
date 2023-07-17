const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    paymentid: { type: String },
    orderid: { type: String },
    status: { type: String, required: true }
});

module.exports = mongoose.model('Order', orderSchema);

// const Sequalize = require('sequelize');
// const sequelize = require('../util/database');

// const Order = sequelize.define('order', {
//     id: {
//         type: Sequalize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey:true
//     },
//     paymentid: Sequalize.STRING,
//     orderid: Sequalize.STRING,
//     status: Sequalize.STRING
// })

// module.exports = Order;