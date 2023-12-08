const db = require("../db");
// Just like with the students.js route, we are too afraid to remove this. Not used anymore. 
const studentSchema = new db.Schema({
    name:      String,
    major:     String,
    gpa:       { type: Number, min: 0, max: 4 }
 });


const Student = db.model("Student", studentSchema);

module.exports = Student;