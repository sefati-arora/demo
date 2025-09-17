const Models = require("../models/index");
const Joi = require("joi");
const otpManager = require("node-twillo-otp-manager")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  process.env.TWILIO_SERVICE_SID
);
const helper = require("../helper/validation");
const jwt=require("jsonwebtoken")
const commonhelper = require("../helper/commonHelper");
require("dotenv").config();

module.exports = {
  signUp: async (req, res) => {
    try {
      console.log(req.body);
      // console.log(req.files.file);

      // return;
      const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        countryCode:Joi.string().required()
      });
      const payload = await helper.validationJoi(req.body, schema);
      const { password } = payload;
      const hashpassword = await commonhelper.bcryptData(password, 10);
      // const file = req.files.file;
      // if (!file) {
      //   return res.status(404).json({ message: "file not found" });
      // }
      // const filepath = await commonhelper.fileUpload(file);
      const user = await Models.userModel.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: hashpassword,
        phoneNumber: payload.phoneNumber,
        // profileImage: filepath,
        countryCode:payload.countryCode
      });
      return res.status(200).json({ message: "data entered", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "server error", error });
    }
  },

  login: async (req, res) => {
    try {
      // console.log(req,body);
      // return;
      const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      });
      const payload = await helper.validationJoi(req.body, schema);
      const emailexist = await Models.userModel.findOne({
        where: { email: payload.email },
      });
      if (!emailexist) {
        return res.status(404).json({ message: "!not found" });
      }
      const compare = await commonhelper.comparePassword(
        payload.password,
        emailexist.password
      );
      if (!compare) {
        res.status(404).json({ message: "invalid password" });
      }
    //  console.log(emailexist.SECRET_KEY);
    //  return;
       let token=jwt.sign({id:emailexist.id},process.env.SECRET_KEY);
       console.log('SECRET_KEY:', process.env.SECRET_KEY);
      res.status(200).json({ message: "login successfully done",token });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "error..", error });
    }
  },
  sidIdGenerateTwilio: async (req, res) => {
    try {
      const serviceSid = await otpManager.createServiceSID("Test", "4");
      console.log("Service SID created:", serviceSid);
      return serviceSid;
    } catch (error) {
      console.error("Error generating Service SID:", error);
      throw new Error("Failed to generate Service SID");
    }
  },
 optsend: async(req,res) =>
 {
  try{
   const{countryCode,phoneNumber}=req.body;
   const userexist= await Models.userModel.findOne({where:{phoneNumber:req.body.phoneNumber}});
   const phone= req.body.countryCode+req.body.phoneNumber;
   if(userexist)
   {
    console.log("...",userexist)
    const OtpResponse= await otpManager.sendOTP(phone);
    console.log("opt send",OtpResponse);
    return res.status(200).json({message:"otp successfully send"});
   }
   else
   {
    return res.status(404).json({message:"user not found"});
   }
  }
  catch(error)
  {
    console.log(error);
    return res.status(400).json({message:"error while sending OTP"});
  }
 },
   otpVerify: async(req,res ) =>
   {
    try{
     console.log("re.body",req.body);
     const{countryCode,phoneNumber, otp}=req.body;
     if(!otp||!phoneNumber)
     {
      res.status(400).json({message:"please provide otp"});
     }
     const whereCondition={countryCode,phoneNumber};
    const user= await Models.userModel.findOne({where:whereCondition});
    if(!user)
    {
      return res.status(404).json({message:"!user not found"});
    }
    const phone=user.countryCode+user.phoneNumber;
      try {
          const verificationCheck = await otpManager.verifyOTP(phone, otp);
          if (verificationCheck.status != "approved") {
        return res.status(400).json({message:"invalid otp"});
          }
      } catch (err) {
        console.error("Twilio OTP verification failed:", err);
        return res.status(400).json({message:"invalid otp"});
      }
    const userdata=
    {
      otpVerify:1,
    };
    await Models.userModel.update(userdata,{where:{id:user.id}});
    await Models.userModel.findOne({where:{id:user.id}});
    const token=jwt.sign({id:user.id},process.env.SECRET_KEY);
    return res.status(200).json({message:"otp verified successfully",token});
  }
  catch(error)
  {
    console.log(error)
    return res.status(400).json({message:"OTP verification failed"});

  }
    },
  resendOtp: async(req,res) =>
  {
    try{
      const{countryCode,phoneNumber}=req.body;
      const userexist= await Models.userModel.findOne({phoneNumber:req.body.phoneNumber});
      const phone= req.body.countryCode+req.body.phoneNumber;
      if(userexist)
      {
        OtpResponse= await otpManager.sendOTP(phone);
        console.log("OTP successfully send",OtpResponse);
        return res.status(200).json({message:"OTP send successfully"});
      }
      else
      {
        return res.status(404).json({message:"User not found"});
      }
    }
    catch(error)
    {
      console.log(error);
      return res.status(400).json({message:"Error while sending OTP"})
    }
  },
 
};

 