const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenceSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
})

module.exports = mongoose.model('Expence', expenceSchema);


// const Sequalize = require('sequelize');
// const sequelize = require('../util/database');


// const Expence = sequelize.define('expence', {
//     id: {
//         type: Sequalize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     amount: {
//         type: Sequalize.INTEGER,
//         allowNull: false
//     },
//     description: {
//         type: Sequalize.STRING,
//         allowNull: false
//     },
//     category: {
//         type: Sequalize.STRING,
//         allowNull: false
//     }
// });

// module.exports = Expence;