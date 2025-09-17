const Models= require('../models/index');
const commonHelper=require('../helper/commonHelper');
const otpManager = require("node-twillo-otp-manager")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  process.env.TWILIO_SERVICE_SID
);
const nodemailer=require("nodemailer");

module.exports=
{
    
  otpVerified: async(req ,res) =>
  {
    try{
       const{countryCode,phoneNumber,email}=req.body;
       const user=await Models.userModel.findOne({where:{phoneNumber}});
       const userexist= await Models.userModel.findOne({where:{email}});
       if(!user)
       {
        return res.status(404).json({message:"user SMS not found"});
       }
       if(!userexist)
       {
        return res.status(404).json({message:"user not found"});
       }
       const phone= req.body.countryCode+req.body.phoneNumber;
        const otp= Math.floor(1000 +( Math.random() * 9000)); 
        const response= await otpManager.sendOTP(phone);
        console.log("OTP send on SMS successfully",response);
        const emailsender=await commonHelper.otpSendLinkHTML(req,userexist.email,otp,"verified");
        console.log("otp send successfully ",emailsender);
        console.log("..",emailsender);
         userexist.otp = otp;
         userexist.otpVerified = 0;
      await userexist.save();
       return res.status(200).json({message:"OTP send successfully"});
    }
    catch(error)
    {
        console.log(error);
        return res.status(400).json({message:"Error while sending OTP"});
    }
  }
}
