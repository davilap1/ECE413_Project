const db = require("../db");

const particleSchema = new db.modle("particleSchema", {
    deviceID: {type: String},
    HR: {type: Number},
    SPO2: {type: Number},
    published_at: {type: Date, default: Date.now},
});

//const Particle = db.model("Particle", particleSchema);

module.exports = particleSchema;
