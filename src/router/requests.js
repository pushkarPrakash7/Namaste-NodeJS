const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    res.send("Connection Request Sent");
    console.log(user.firstName+" "+user.lastName+" sent the connection request");
})

module.exports = requestRouter;
