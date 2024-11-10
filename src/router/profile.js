const express = require('express');
const { userAuth }  = require('../middlewares/auth.js');
const profileRouter = express.Router();
const {validateUserProfileUpdate, validatePassword} = require("../utils/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (error) {
        res.status(404).send(error.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async(req,res) => {
    try{
        if(!validateUserProfileUpdate(req)){
            throw new Error("Invalid update data");
        }

        const loggedInUser = req.user;
        console.log(loggedInUser);
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        console.log(loggedInUser);
        res.send(`${loggedInUser.firstName}, your profile has been updated successfully`)
    }
    catch(error){
        res.status(404).send(error.message);
    }
})

profileRouter.patch("/profile/password", async(req,res)=>{
    try{
        const {emailId, newPassword} = req.body;
        if(!emailId || !newPassword){
            throw new Error("Incomplete password data");
        }
        const user = await User.findOne({emailId: req.body.emailId});
        if(!user){
            throw new Error("User not found");
        }
        if(!validatePassword(newPassword)){
            throw new Error("Invalid password format or Password is not strong enough");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.send("Password Updated successfully!");
    }
    catch(error){
        res.status(400).send(error.message);
    }
})

module.exports = profileRouter;
