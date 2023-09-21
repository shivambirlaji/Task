const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('test', 'shivam', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
