const express=require("express");
const apiController= require('../controller/productapiController');
const router= express.Router();

router.post('/productdetail',apiController.productdetail);

module.exports=router;