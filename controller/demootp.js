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
    
 otpVerified: async (req, res) => {
  try {
    console.log("...",req.body)
    const {phoneNumber,countryCode, email } = req.body;
    if (!phoneNumber || !email || !countryCode) {
      return res.status(400).json({ message: "countryCode, phoneNumber, and email are required" });
    }
 
    const user = await Models.userModel.findOne({ where: { phoneNumber} });
    console.log(">>>>",phoneNumber);
 
    const userexist = await Models.userModel.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User SMS not found" });
    }

    if (!userexist) {
      return res.status(404).json({ message: "User not found" });
    }

    const phone = countryCode + phoneNumber;
    const otp = Math.floor(1000 + Math.random() * 9000);

    const response = await otpManager.sendOTP(phone);
    console.log("OTP sent via SMS successfully", response);

    const emailsender = await commonHelper.otpSendLinkHTML(req, userexist.email, otp, "verified");
    console.log("OTP sent via email successfully", emailsender);

    userexist.otp = otp;
    userexist.otpVerified = 0;
    await userexist.save();

    return res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("Error in otpVerified:", error);
    return res.status(400).json({ message: "Error while sending OTP" });
  }
}

}
