const deviceData = require("../models/iotDevice");
const router = require("express").Router();


// Add a new song to the database
router.post("/update", function(req, res) {
   const iotData = req.body;
   song.save(function(err, song) {
      if (err) {
         res.status(400).send(err);
      } 
      else {
         res.status(201).json(song);
      }
   });
});

module.exports = router;