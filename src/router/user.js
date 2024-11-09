const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");
const User = require("../models/user.js");
userRouter.get("/user", userAuth, async (req, res) => {
    const email = req.body.emailId;
    try {
        const user = await User.find({ emailId: email });
        if (user.length === 0) {
            res.status(404).send("User not found")
        }
        else
            res.send(user);
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

userRouter.get("/feed", async (req, res) => {
    try {
        const user = await User.find({});
        if (user.length === 0) {
            res.status(404).send("No users available in the database");
        }
        else {
            res.send(user);
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

//Deleting a particular user by id
userRouter.delete("/user", async (req, res) => {
    const id = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).send("User not found")
        }
        else
            res.send("User deleted successfully");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

//Updating the records of a particular user
userRouter.patch("/user", async (req, res) => {
    const id = req.body.userId;
    const data = req.body;
    const ALLOWED_UPDTAES = ["photoURL", "about", "gender", "age"]

    const isAllowedUpdate = Object.keys(data).every((k) =>
        ALLOWED_UPDTAES.includes(k));

    if (!isAllowedUpdate) {
        res.status(400).send("Invalid updates, only photoURL, about, gender, and age are allowed");
    }
    try {
        const user = await User.findByIdAndUpdate({ _id: id }, data);
        res.send("USER UPDATED SUCCESSFULLY");
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

module.exports = userRouter;