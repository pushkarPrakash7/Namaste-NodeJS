const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const User = require("../models/user.js");
const connectionRequest = require("../models/connectionRequest.js");
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

//Get all the pending connection Request for the logged In user
userRouter.get("/user/requests", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const data = await connectionRequest.find({ toUserId: loggedInUser._id, status: "interested" }).populate("fromUserId", ["firstName", "lastName", "photoURL", "age", "gender"]);
        res.json({
            message: "data fetched Successfully",
            data
        });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

//Get all the data of people connected to the loggedIn User
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await connectionRequest.find({ $or: [{ fromUserId: loggedInUser._id, status: "accepted" }, { toUserId: loggedInUser._id }], status: "accepted" }).populate("fromUserId", ["firstName", "lastName", "photoURL", "age", "gender"]).populate("toUserId", ["firstName", "lastName", "photoURL", "age", "gender"]);
        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            else {
                return row.fromUserId
            }
        });
        res.json({
            message: "data fetched successfully",
            data: data
        });
    }
    catch (error) {
        res.status(404).send(error.message);
    }
})

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