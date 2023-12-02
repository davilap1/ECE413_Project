// to use mongoDB
const mongoose = require("mongoose");
mongoose.set('strictQuery', true); // or false if you want to suppress this warning
mongoose.connect("mongodb://127.0.0.1/authen", { useNewUrlParser: true, useUnifiedTopology:true });


module.exports = mongoose;
