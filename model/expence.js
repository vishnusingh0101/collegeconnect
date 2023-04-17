const Sequalize = require('sequelize');
const sequelize = require('../util/database');


const Expence = sequelize.define('expence', {
    id: {
        type: Sequalize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount: {
        type: Sequalize.INTEGER,
        allowNull: false
    },
    description: {
        type: Sequalize.STRING,
        allowNull: false
    },
    category: {
        type: Sequalize.STRING,
        allowNull: false
    }
});

module.exports = Expence;