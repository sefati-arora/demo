

module.exports=(Sequelize,sequelize,DataTypes) =>
{
    return sequelize.define(
        "usertable",
        {
            ...require('./core')(Sequelize,DataTypes),
            firstName:{
                type:DataTypes.STRING(50),
                allowNull:true,
            },
            lastName:{
                type:DataTypes.STRING(50),
                allowNull:true,
            },
            email:{
                type:DataTypes.STRING(50),
                allowNull:true,
            },
            password:{
                type:DataTypes.STRING(100),
                allowNull:true,
            },
            phoneNumber:{
                type:DataTypes.STRING(60),
                allowNull:true,
            },
            profileImage:{
                type:DataTypes.STRING(255),
                allowNull:true,
            },
         countryCode:{
            type:DataTypes.STRING(255),
            allowNull:true,
         },
        // otpVerify: {
        //     type:DataTypes.INTEGER,
        //         allowNull:true,
        //         defaultValue:0, // 0 not verified 1 verified
        // },
        otpVerified:{
            type:DataTypes.INTEGER,
            allowNull:true,
            defaultValue:0,
        },
         otp:{
            type:DataTypes.STRING,
            allowNull:true,
            defaultValue:null,
         }
        },
        {
          tableName:"usertable",
        }
    );
};