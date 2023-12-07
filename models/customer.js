const db = require("../db");

const customerSchema = new db.Schema({
    email:          String,
    passwordHash:   String,
    device: { type: [String], default: [] }, // Specify 'device' as an array of strings with a default value of an empty array
    lastAccess:     { type: Date, default: Date.now },
 });


 const Customer = db.model("Customer", customerSchema);

module.exports = Customer;