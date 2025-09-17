module.exports=(Sequelize,sequelize,DataTypes) =>
{
    return sequelize.define(
        "imageUpload",
        {
          ...require('./core')(Sequelize,DataTypes),
          userId:{
            type:DataTypes.STRING(100),
            allowNull:false,
          },
          
          imageUpload:{
            type:DataTypes.STRING(255),
            allowNull:true,
          }
        },
        {
           tableName:"imageUpload"
        }
    );
};