const Sequelize = require('sequelize');

// const sequelize = new Sequelize("postgres://postgres:" + process.env.PASSWORD + "@localhost:5432/redbadgeprojectserver");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    ssl: process.env.ENVIRONMENT === 'production'
    })
    


module.exports = sequelize;


