var express = require('express');
var router = express.Router();
var IotDevice = require('../models/iotDevice');
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');




//recive iot data
router.post("/data", function (req, res){
    var msgStr ="YAY";
		
	res.status(201).json({message: msgStr});
		
	

    
});

module.exports = router;