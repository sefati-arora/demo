const Models=require('../models/index');
const Joi=require("joi");
const helper=require('../helper/validation');
const commonHelper=require('../helper/commonHelper');
module.exports ={
    productdetail: async (req,res) =>{
        try{
            console.log("======",req.body)
            console.log(">>>>>",req.files)
            // return;    
            
                const schema=Joi.object({
                productName:Joi.string().required(),
                category:Joi.string().required(),
                subCategory:Joi.string().required(),
                price:Joi.string().required(),
                Description:Joi.string().required()
            })
            const payload= await helper.validationJoi(req. body,schema);
            const file = req.files?.productImage;
            if(!file)
            {
                return res.status(404).json({message:"not found!"});
            }
            const filepath= await commonHelper.fileUpload(file);
            console.log("filepath filepath====",filepath);
            // return;
            
          const user=await Models.productModel.create({
            productImage:filepath,
            productName:payload.productName,
            category:payload.category,
            subCategory:payload.subCategory,
            price:payload.price,
            Description:payload.Description
          });
            return res.status(200).json({message:"data entered successfully",user});
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).json({message:"server error",error});
        }
    }
}