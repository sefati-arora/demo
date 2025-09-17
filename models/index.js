const Sequelize= require("sequelize");
const sequelize= require('../config/connectdb').sequelize;

module.exports={
    userModel: require('./userModel')(Sequelize,sequelize,Sequelize.DataTypes),
    productModel:require('./productModel')(Sequelize,sequelize,Sequelize.DataTypes),
    imageUpload:require('./imageUpload')(Sequelize,sequelize,Sequelize.DataTypes)
}