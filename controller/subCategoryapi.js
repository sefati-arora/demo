const Models = require("../models/index");
const Joi = require("joi");
const helper = require("../helper/validation");

Models.subCategoryModel.belongsTo(Models.categoryModel, {
  foreignKey: "categoryId",
  as: "categoryDetails"
})
Models.categoryModel.hasMany(Models.subCategoryModel, {
  foreignKey: "categoryId",
  as: "subCategoryDetail",
});
module.exports = {
  subCategory: async (req, res) => {
    try {
      const schema = Joi.object({
        categoryId: Joi.string().required(),
        productName: Joi.string().required(),
        Description:Joi.string().required(),
        orderDate:Joi.string().required()
      });
      const paylaod = await helper.validationJoi(req.body, schema);
      const user = await Models.subCategoryModel.create({
        categoryId: paylaod.categoryId,
        productName: paylaod.productName,
        Description:paylaod.Description,
        orderDate:paylaod.orderDate
      });
      return res.status(200).json({ message: "data entered successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Error while entering data" });
    }
  },
  getSubcategory: async (req, res) => {
    try {
      console.log("===", req.body);
      const { categoryId } = req.body;
      const sub = await Models.subCategoryModel.findOne({
        where: {
          categoryId: categoryId,
        },
        include:[
          {
            model: Models.categoryModel,
            as: "categoryDetails"
          }
        ],
      });
       const category = await Models.categoryModel.findOne({
        where: { id: categoryId },
        include: [{ model: Models.subCategoryModel, as: "subCategoryDetail" }],
      
      });
       console.log("00000", sub)
       console.log("....",category)
       res
        .status(200)
        .json({ message: "data fetched successfully",sub,category });
    
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "not found", error });
    }
  },
};
