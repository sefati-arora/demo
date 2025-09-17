const Models= require("../models/index");
const Joi= require("joi");
const otpManager = require("node-twillo-otp-manager")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  process.env.TWILIO_SERVICE_SID
);
const helper = require("../helper/validation");
const jwt=require("jsonwebtoken")
const commonhelper = require("../helper/commonHelper");
const userModel = require("../models/userModel");
const commonHelper = require("../helper/commonHelper");
const { response } = require("express");
require("dotenv").config();
module.exports =
{
    // emailsend: async(req,res) =>
    // {
    //     try{
    //         const{email}=req.body;
    //         const userexist= await Models.userModel.findOne({where:{email:email}});
    //         if(userexist)
    //         {
    //             const response= await commonHelper.otpSendLinkHTML(email, otp);
    //             console.log("OTP send successfully",response);
    //             return res.status(200).json({message:"OTP send successfully"});

    //         }
    //         else
    //         {
    //             return res.status(404).json({message:"User not found"});
    //         }
    //     }
    //     catch(error)
    //     {
    //         return res.status(400).json({message:"Error while sending OTP"});
    //     }
    // },
    emailotp:async(req,res) =>
    {
      try
      {
        const schema=Joi.object({
            firstName:Joi.string().required(),
            lastName:Joi.string().required(),
             email:Joi.string().email({tlds:{allow:["com", "net", "org", "in", "us"]}}).required().label("Email"),
        });
        const payload= await helper.validationJoi(req.body,schema);
        const {email}=payload;
        const userexist= await Models.userModel.findOne({where:{email}});
        if(userexist)
        {
            console.log(userexist);
            return res.status(400).json({message:"user already exist"});
        }
        const otp= Math.floor(1000 +( Math.random() * 9000))
        const response= await Models.userModel.create({
            firstName:payload.firstName,
            lastName:payload.lastName,
            email,
            otp,
            otpVerify:0
        });
        try{
            await commonHelper.otpSendLinkHTML(req,email,otp)
            console.log(`OTP send(${email}}):${otp}`);
        }
      
        catch(error)
        {
           await Models.userModel.destroy({where:{id:response.id}});
          return res.status(400).json({message:"Failed to send OTP"});
        }
          console.log(`Test Mode: OTP for email (${email}): ${otp}`);
          return res.status(200).json({message:"OTP send successfully"});
    }
    catch(error)
    {
        console.log("error",error);
       
    }
},
emailotpVerify: async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
     const user = await Models.userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
     if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
        await Models.userModel.update(
      { otpVerify: 1, otp: null },
      { where: { id: user.id } }
    );
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
    return res.status(200).json({message:"OTP verified",token})
    }
    catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  } 
}
}
