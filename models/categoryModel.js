module.exports=(Sequelize,sequelize,DataTypes) =>
{
    return sequelize.define(
        "category",
        {
            ...require('./core')(Sequelize,DataTypes),
         title:{
            type:DataTypes.STRING(255),
            allowNull:false
         },
         Productprice:{
            type:DataTypes.STRING(255),
            allowNull:true
         },
         productBio:{
            type:DataTypes.STRING(225),
            allowNull:true,
         }
             });
}