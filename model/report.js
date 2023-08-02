const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    link: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    createdAt: {
        type: String,
        
    }
})

module.exports = mongoose.model('Report', reportSchema);

// const sequelize = require('../util/database');
// const Sequelize = require('sequelize');

// const expencereport = sequelize.define('expeencereport', {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     link: Sequelize.STRING,
// })

// module.exports = expencereport;