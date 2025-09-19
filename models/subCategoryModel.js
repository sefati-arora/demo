module.exports=(Sequelize,sequelize,DataTypes) =>
{
     return sequelize.define(
        "subCategoryModel",
        {
            ...require('./core')(Sequelize,DataTypes),
            categoryId:{
                type:Sequelize.UUID,
                allowNull:false,
                refernces:
                {
                    models:"categoryModel",
                    key:"id"
                },
                  onUpdate: "CASCADE",
                 onDelete: "CASCADE",
            },
            productName:{
                type:DataTypes.STRING(50),
                allowNull:true
            },
            Description:{
                type:DataTypes.STRING(225),
                allowNull:true
            },
            orderDate:{
                type:DataTypes.STRING(225),
                allowNull:true,
            }
        }

     )
}