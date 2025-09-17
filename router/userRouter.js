const express= require("express");
const apiController=require('../controller/apiController');
const imageController=require('../controller/imageController');
const otpVerify=require('../controller/otpverify');
const otpverified=require('../controller/demootp');
const{authentication} = require('../middleware/authentication');
const router=express.Router();

router.post('/signUp',apiController.signUp);
router.post('/login',apiController.login);
router.post('/imageUpload',imageController.imageUpload);
router.get('/sidIdGenerateTwilio',apiController.sidIdGenerateTwilio);
router.post('/optsend',apiController.optsend);
router.post('/otpVerify',apiController.otpVerify);
router.post('/resendOtp',apiController.resendOtp);
router.post('/emailotp',otpVerify.emailotp);
router.post('/emailotpVerify',otpVerify.emailotpVerify);
router.post('/otpVerified',otpverified.otpVerified)
module.exports=router;