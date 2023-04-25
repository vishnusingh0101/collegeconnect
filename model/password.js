const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const forgotPassword = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})

module.exports = forgotPassword;