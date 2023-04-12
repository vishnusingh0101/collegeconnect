const Sequalize = require('sequelize');

const sequelize = new Sequalize('tracker', 'root', '', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;