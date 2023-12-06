var express = require('express');
var router = express.Router();
var Customer = require("../models/customer");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
const fs = require('fs');

// On AWS ec2, you can use to store the secret in a separate file. 
// The file should be stored outside of your code directory. 
// For encoding/decoding JWT
const secret = fs.readFileSync(__dirname + '/../keys/jwtkey').toString();

// example of authentication
// register a new customer

// please fiil in the blanks
// see javascript/signup.js for ajax call
// see Figure 9.3.5: Node.js project uses token-based authentication and password hashing with bcryptjs
// in https://learn.zybooks.com/zybook/ARIZONAECE413SalehiFall2022/chapter/9/section/3

router.post("/signUp", function (req, res) {
   Customer.findOne({ email: req.body.email }, function (err, customer) {
       if (err) res.status(401).json({ success: false, err: err });
       else if (customer) {
           res.status(401).json({ success: false, msg: "This email already used" });
       }
       else {
           const passwordHash = bcrypt.hashSync(req.body.password, 10);
           console.log(req.body);
           const newCustomer = new Customer({
               email: req.body.email,
               passwordHash: passwordHash
           });

           newCustomer.device.push(req.body.deviceName);

           newCustomer.save(function (err, customer) {
               if (err) {
                   res.status(400).json({ success: false, err: err });
               }
               else {
                   let msgStr = `Customer (${req.body.email}) account has been created.`;
                   res.status(201).json({ success: true, message: msgStr });
                   console.log(msgStr);
               }
           });
       }
   });
});


// please fill in the blanks
// see javascript/login.js for ajax call
// see Figure 9.3.5: Node.js project uses token-based authentication and password hashing with bcryptjs
// in https://learn.zybooks.com/zybook/ARIZONAECE413SalehiFall2022/chapter/9/section/3

router.post("/logIn", function (req, res) {
   if (!req.body.email || !req.body.password) {
       res.status(401).json({ error: "Missing email and/or password" });
       return;
   }
   // Get user from the database
   Customer.findOne({ email: req.body.email }, function (err, customer) {
       if (err) {
           res.status(400).send(err);
       }
       else if (!customer) {
           // Username not in the database
           res.status(401).json({ error: "Login failure!!" });
       }
       else {
           if (bcrypt.compareSync(req.body.password, customer.passwordHash)) {
               const token = jwt.encode({ email: customer.email }, secret);
               //update user's last access time
               customer.lastAccess = new Date();
               customer.save((err, customer) => {
                   console.log("User's LastAccess has been update.");
               });
               // Send back a token that contains the user's username
               res.status(201).json({ success: true, token: token, msg: "Login success" });
           }
           else {
               res.status(401).json({ success: false, msg: "Email or password invalid." });
           }
       }
   });
});

router.post("/changePassword", function (req, res) {
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ success: false, msg: "Missing X-Auth header" });
    }
 
    // X-Auth should contain the token 
    const token = req.headers["x-auth"];
    // Decode the token (does not verify the signature)
    const decodedToken = jwt.decode(token, secret);

    // Implement your verification logic based on the decoded payload
    if (decodedToken) {
    // Check expiration if 'exp' claim exists
        if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
            console.log('Token has expired');
            console.log(decodedToken);
        } else {
            console.log('Token is valid');
            console.log(decodedToken); // Decoded payload (contains claims)


        // You can perform additional verification based on your requirements
            try {
                // const decoded = jwt.verify(token, secret);
                Customer.findOne({ email: decodedToken["email"] }, function (err, customer) {
                if (err) {
                    res.status(400).send(err);
                }
                else if (!customer) {
                    // Password not in the database
                    res.status(401).json({ error: "Login failure!!" });
                }
                else {
                    if (bcrypt.compareSync(req.body.oldPassword, customer.passwordHash)) {
                        customer.passwordHash = bcrypt.hashSync(req.body.newPassword, 10)
                        customer.save((err, updatedcustomer) => {
                            if (err) {
                                res.status(500).json({ success: false, error: "Error updating password" });
                            } else {
                                console.log("User's Password has been updated.");

                                res.status(200).json({ success: true, msg: "Password change success!" });
                            }
                        });
                    }
                    else {
                        console.log("PLEASE");
                        // window.alert("Incorrect Account Password.");
                        res.status(401).json({ success: false, msg: "Incorrect Account Password." });
                    }
                }
            });
            }
            catch (ex) {
                res.status(401).json({ success: false, message: "Invalid JWT" });
            }
        }
    } else {
        console.log('Token decoding failed');
    }
});


// please fiil in the blanks
// see javascript/account.js for ajax call
// see Figure 9.3.5: Node.js project uses token-based authentication and password hashing with bcryptjs
// in https://learn.zybooks.com/zybook/ARIZONAECE413SalehiFall2022/chapter/9/section/3

router.get("/status", function (req, res) {
   // See if the X-Auth header is set
   if (!req.headers["x-auth"]) {
       return res.status(401).json({ success: false, msg: "Missing X-Auth header" });
   }

   // X-Auth should contain the token 
   const token = req.headers["x-auth"];
   try {
       const decoded = jwt.decode(token, secret);
       // Send back email and last access
       Customer.find({ email: decoded.email }, "email lastAccess device", function (err, users) {
           if (err) {
               res.status(400).json({ success: false, message: "Error contacting DB. Please contact support." });
           }
           else {
               res.status(200).json(users);
               console.log(users);
           }
       });
   }
   catch (ex) {
       res.status(401).json({ success: false, message: "Invalid JWT" });
   }
});

router.get("/addDevice", function (req, res) {
    // See if the X-Auth header is set
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ success: false, msg: "Missing X-Auth header" });
    }

    // X-Auth should contain the token 
    const token = req.headers["x-auth"];
    console.log(req.body.deviceName);
    try {
        const decoded = jwt.decode(token, secret);

        Customer.updateOne({ email: decoded.email }, { $addToSet: { device: req.body.deviceName } }, function (err, users) {
            if (err) {
                res.status(400).json({ success: false, message: "Error contacting DB. Please contact support." });
            }
            else {
                console.log("poopy")
                res.status(200).json(users);
                console.log(users);
            }
        });
    }
    catch (ex) {
        res.status(401).json({ success: false, message: "Invalid JWT" });
    }
    
});


module.exports = router;