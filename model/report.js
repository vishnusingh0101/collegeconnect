const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const expencereport = sequelize.define('expeencereport', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    link: Sequelize.STRING,
})

module.exports = expencereport;