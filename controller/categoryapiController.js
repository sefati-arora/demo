const Models=require('../models/index')
const express=require('express');
const Joi= require("joi");
const helper = require("../helper/validation");

module.exports={
    category: async(req ,res)=>
    {
        try{
            const schema=Joi.object({
              title:Joi.string().required(),
               Productprice:Joi.string().required(),
               productBio:Joi.string().required()
            });
            const payload= await helper.validationJoi(req.body,schema);
            const user= await Models.categoryModel.create({
                title:payload.title,
               Productprice:payload.Productprice,
               productBio:payload.productBio
            });
            return res.status(200).json({message:"Enter data successfully",user});
        }
        catch(error)
        {
            console.log(error);
            return res.status(400).json({message:"Error while entering data",error});
        }
    }
}