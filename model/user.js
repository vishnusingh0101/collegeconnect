const sequelize = require('../util/database');
const Sequalize = require('sequelize');

const User = sequelize.define('user', {
    id: {
        type: Sequalize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequalize.STRING,
        allowNull: false
    },
    mail: {
        type: Sequalize.STRING,
        allowNull:false,
        unique: true
    },
    password: {
        type: Sequalize.STRING,
        allowNull:false
    },
    ispremiumuser: {
        type: Sequalize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = User;