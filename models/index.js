const initModels = require('./init-models'); // init-models.js에서 메서드를 가져온다.
const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const { database } = require("../config/config")
const config = database[env]

const sequelize = new Sequelize(config.database, config.username, config.password, config)

const models = initModels(sequelize);

module.exports = models;