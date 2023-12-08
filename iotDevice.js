const db = require("../db");

const iotDeviceSchema = new db.Schema({
    deviceName: String,
    key:        String,
    heartRate:  Number,
    startRange: Number,
    endRange:   Number,
    readings: {
        dateTime :  Date,
        heartRate:  Number,
        bloodOxy:   Number
    }
 });


 const IotDevice = db.model("IotDevice", iotDeviceSchema);

module.exports = IotDevice;