const express = require('express');
const { validateSignUpData, validateEmail } = require("../utils/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    //Validate data 
    try {
        validateSignUpData(req);
        const { password } = req.body;
        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        //Creating a new user
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailId: req.body.emailId,
            password: passwordHash,
            age: req.body.age,
            gender: req.body.gender,
            photoURL: req.body.photoURL,
            about: req.body.about,
            skills: req.body.skills
        });


        await user.save();
        res.status(201).send('User added successfully');
    }
    catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        validateEmail(req);
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {

            //Create a JWT token
            const token = await user.getJWT();

            //Add the token to cookie and send response back to the user
            res.cookie("token", token, { expires: new Date(Date.now()+ 8*360000)});
            res.send("Login Successful");
        }
        else {
            throw new Error("Invalid Password");
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = authRouter;

