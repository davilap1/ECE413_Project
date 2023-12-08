const db = require("../db");

const customerSchema = new db.Schema({
    email:          String,
    passwordHash:   String,
    device:         [{type: String}],
    lastAccess:     { type: Date, default: Date.now },
    iotData:        { type: Number }
 });


 const Customer = db.model("Customer", customerSchema);

module.exports = Customer;