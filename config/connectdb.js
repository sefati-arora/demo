const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("demo", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});
const connectdb = async () => {
  try {
    await sequelize.authenticate().then(async () => {
      await sequelize.sync({ alter: true });
      console.log("db connected ans sync ");
    });
  } catch (error) {
    console.log("unable to connect", error);
  }
};

module.exports = {
  connectdb,
  sequelize,
};
