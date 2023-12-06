var express = require('express');
var router = express.Router();
var Student = require("../models/student");

// CRUD implementation
router.post("/create", function(req, res){
   const newStudent = new Student({
      name: req.body.name,
      major: req.body.major,
      gpa: req.body.gpa      
   });
   newStudent.save(function(err, student) {
      if (err) {
         res.status(400).send(err);
      } 
      else {
         let msgStr = `Student (${req.body.name}) info has been saved.`;
         res.status(201).json({message: msgStr});
         console.log(msgStr);
      }
   });

});

router.get('/count', function (req, res) {
   Student.estimatedDocumentCount(function(err, count) {
      if (err){
         let msgStr = `Something wrong....`;
         res.status(201).json({message: msgStr});
      }
      else {
         res.status(201).json({count: count});
      }      
   });
});

router.get('/readAll', function (req, res) {
   Student.find(function (err, docs) {
      if (err){
         let msgStr = `Something wrong....`;
         res.status(201).json({message: msgStr});
      }
      else{
         res.status(201).json(docs);
      }
   });
});




module.exports = router;