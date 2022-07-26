const Sequelize = require('sequelize')

const sequelize = new Sequelize('node-complete', 'root', 'm2433',{
    dialect: "mysql",
    host: "localhost",
})

module.exports = sequelize