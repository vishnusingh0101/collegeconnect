const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotpasswordSchema = new Schema({
    uuid: {
        type:String,
    },
    active: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = mongoose.model('forgotpassword', forgotpasswordSchema);

// const sequelize = require('../util/database');
// const Sequelize = require('sequelize');

// const forgotPassword = sequelize.define('forgotpassword', {
//     id: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: {
//         type: Sequelize.BOOLEAN,
//         defaultValue: false
//     }
// })

// module.exports = forgotPassword;