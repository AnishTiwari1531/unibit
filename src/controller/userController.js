const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const { isValidName, isValidEmail, isValidRequest, isValidValue, isValidNumber } = require("../utils/validator");
const saltRounds = 10;

//----------------------------------USER-Sign Up --------------------------------//

const createUser = async (req, res) => {
    try {
        let data = req.body;

        const { name, email, password, gender, phone } = data;

        //Request Validation
        if (!isValidRequest(data)) {
            return res.status(400).send({ Status: 'Failed', Message: "Please fill the details" });
        }

        //Name Validation
        if (!isValidValue(name)) {
            return res.status(400).send({ Status: 'Failed', Message: "Please enter your Name" });
        }
        if (!isValidName(name)) {
            return res.status(400).send({ Status: 'Failed', Message: "Enter your name properly" });
        }

        //Email Validation & Duplicate Checking
        if (!isValidValue(email)) {
            return res.status(400).send({ Status: 'Failed', Message: "Please enter your email" });
        }
        if (!isValidEmail(email)) {
            return res.status(400).send({ Status: 'Failed', Message: "Email is not valid" });
        }

        const emailExist = await userModel.findOne({ email });
        if (emailExist) {
            return res.status(400).send({ Status: 'Failed', Message: "This email already exists" });
        }

        //Password Validation
        if (!password || password.length < 8 || password.length > 15) {
            return res.status(400).send({
                Status: 'Failed',
                Message: "Password length should be between 8 to 15"
            });
        }
        if (req.body.password.trim().length !== req.body.password.length) {
            return res.status(400).send({ Status: 'Failed', Message: "Space not allowed in Password" });
        }

        req.body.password = await bcrypt.hash(password, saltRounds);    //Password Hashing

        if (!isValidNumber(phone)) {
            return res.status(400).send({ Status: 'Failed', Message: "Phone number is not valid" });
        }

        const checkPhone = await userModel.findOne({ phone });
        if (checkPhone) {
            return res.status(400).send({ Status: 'Failed', Message: "This number already exists" });
        }

        if (gender) {
            if (!(["Male", "Female", "Others"].includes(gender))) {
                return res.status(400).send({ Status: false, message: "Please provide valid gender" })
            }
        }

        let newUser = await userModel.create(data);
        
        newUser = newUser.toObject();
        delete newUser.password;
        delete newUser.role;
        delete newUser.isDeleted;


        //Gmail....https://myaccount.google.com/ >>> Security >>> App PAssword >>>Generate new pswd
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            secure: true,
            auth: {
                user: 'anishtiwariatwork@gmail.com',
                pass: 'cnjjengefnxlaetn'
            }
        });

        const mailOptions = {
            from: '"ANISH TIWARI" <anishtiwariatwork@gmail.com>',
            to: newUser.email,
            subject: 'Registration Successful',
            text: `Dear ${newUser.name},
            Your registration was successful!
            Thank you for registering. Your account has been created.`,
        };


        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Email sent!");
            }
        });

        return res.status(201).send({ Status: 'Success', 'User Details': newUser });
    }
    catch (error) {
        res.status(500).send({ Status: 'Failed', Message: error.message });
    }
};



//----------------------------------USER-Sign In --------------------------------//

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Request Validation
        if (!isValidRequest(req.body)) {
            return res.status(400).send({ Status: 'Failed', Message: "Enter email & password" });
        }

        //Email Validation
        if (!isValidValue(email)) {
            return res.status(400).send({ Status: 'Failed', Messgage: "Enter your Email" });
        }

        const checkUser = await userModel.findOne({ email: email });
        if (!checkUser) {
            return res.status(404).send({ Status: 'Failed', Message: "Email not found" });
        }

        //Password Validation
        if (!isValidValue(password)) {
            return res.status(400).send({ Status: 'Failed', Messsge: "Enter Password to login" });
        }

        let decryptPassword = await bcrypt.compare(password, checkUser.password);
        if (!decryptPassword) {
            return res.status(401).send({ Status: 'Failed', Message: "Password is not correct" });
        }


        //TOKEN CREATION

        const currTimeStamp = Date.now();
        const createTime = Math.floor(currTimeStamp / 1000);
        const expTime = createTime + (12 * 60 * 60);

        const token = jwt.sign(
            {
                userId: checkUser._id.toString(),
                iat: createTime,
                exp: expTime,
            },
            "unibit"
        );

        res.setHeader("x-api-key", token);
        return res.status(200).send({ Status: "Success", Token: token });
    }
    catch (error) {
        res.status(500).send({ Status: 'Failed', Message: error.message });
    }
};

//----------------------------------GET-USER-Profile For Admin--------------------------------//


const getUserDetails = async (req, res) => {
    try {
        let searchObject = {};
        let { name, email, phone } = req.query;

        if (name) {
            searchObject["name"] = name;
        }
        if (email) {
            searchObject["email"] = email;
        }
        if (phone) {
            searchObject["phone"] = phone;
        }

        let data = await userModel.find(searchObject).select({ role: 0, password: 0, createdAt: 0, updatedAt: 0, _id: 0, isDeleted: 0 })

        if (data.length !== 0) {
            return res.status(200).send({ status: true, message: "Success", Data: data });
        } else if (data.length === 0) {
            return res.status(404).send({ status: false, message: "No Data found" });
        }

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

//----------------------------------GET - ALL - USERNAME--------------------------------//

const getAllUserName = async (req, res) => {
    try {

        let data = await userModel.find().select({ name: 1  })

        if (data.length !== 0) {
            return res.status(200).send({ status: true, message: "Success", Data: data });
        } else if (data.length === 0) {
            return res.status(404).send({ status: false, message: "No Data found" });
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//----------------------------------USER-Profile Update --------------------------------//

const updateUser = async (req, res) => {
    try {
        let data = req.body;

        //Request Validation
        if (!isValidRequest(data)) {
            return res.status(400).send({ Status: 'Failed', Message: "Nothing to update" });
        }

        const { name, email, password, gender, phone } = data;

        let updatedData = {};

        //Name Validation
        if (Object.keys(data).includes('name')) {
            if (!isValidValue(name)) {
                return res.status(400).send({ Status: 'Failed', Message: "Please enter your Name" });
            }
            if (!isValidName(name)) {
                return res.status(400).send({ Status: 'Failed', Message: "Enter your name properly" });
            }
            updatedData.name = name;
        }

        //Email Validation
        if (Object.keys(data).includes('email')) {
            if (!isValidValue(email)) {
                return res.status(400).send({ Status: 'Failed', Message: "Please enter your email" });
            }
            if (!isValidEmail(email)) {
                return res.status(400).send({ Status: 'Failed', Message: "Email is not valid" });
            }
            let emailExist = await userModel.findOne({ email });
            if (emailExist) {
                return res.status(400).send({ Status: 'Failed', Message: "This email already exists" });
            }
            updatedData.email = email;
        }

        //Password Validation
        if (Object.keys(data).includes('password')) {
            if (password.length < 8 || password.length > 15) {
                return res.status(400).send({
                    Status: 'Failed',
                    Message: "Password length should be between 8 to 15"
                });
            }

            if (req.body.password.trim().length !== req.body.password.length) {
                return res.status(400).send({ Status: 'Failed', Message: "Space not allowed in Password" });
            }

            //Hashing Password
            req.body.password = await bcrypt.hash(password, saltRounds);
            updatedData.password = password;
        }

        if (Object.keys(data).includes('phone')) {
            if (!isValidNumber(phone)) {
                return res.status(400).send({ Status: 'Failed', Message: "Phone number is not valid" });
            }

            const checkPhone = await userModel.findOne({ phone });
            if (checkPhone) {
                return res.status(400).send({ Status: 'Failed', Message: "This number already exists" });
            }
            updatedData.phone = phone;
        }

        if (Object.keys(data).includes('gender')) {
            if (!(["Male", "Female", "Others"].includes(gender))) {
                return res.status(400).send({ Status: false, message: "Please provide valid gender" })
            }
            updatedData.gender = gender;
        }

        await userModel.findByIdAndUpdate({ _id: req.params.userId }, updatedData, { new: true });
        return res.status(200).send({ Status: "Success", "Message": 'User Profile Updated' });
    }
    catch (error) {
        res.status(500).send({ Status: 'Failed', Message: error.message });
    }
}



//----------------------------------USER-Profile Delete --------------------------------//

const deleteUser = async (req, res) => {
    try {
        let userId = req.params.userId;

        if (!mongoose.isValidObjectId(userId))
            return res.status(400).send({ status: false, message: "userId is not valid" });

        let deleteUser = await userModel.findOneAndUpdate({ _id: userId, isDeleted: false },
            {
                $set: { isDeleted: true }
            }, { new: true });

        if (!deleteUser) return res.status(404).send({ status: false, message: `No user with id ${userId} found` });

        return res.status(204).send({ Status: "Success" });
    } catch (error) {
        res.status(500).send({ Status: "Failed", Message: error.message });
    }
}

//------------------------------------------------------------------------------------//

module.exports = { createUser, login, getUserDetails, getAllUserName, updateUser, deleteUser }