const db = require("../db");

const customerSchema = new db.Schema({
    email:          String,
    passwordHash:   String,
    device:         {type: String , default: 'Unknown'},
    lastAccess:     { type: Date, default: Date.now },
 });


 const Customer = db.model("Customer", customerSchema);

module.exports = Customer;