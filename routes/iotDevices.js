var express = require('express');
var router = express.Router();
var IotDevice = require('../models/iotDevice');
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');



//recive iot data
router.post("/data", function (req, res){
    console.log(req);
    console.log(req.body);
    if (res = error) {
        res.status(400);
    } else {
        res.status(201);
    }
});