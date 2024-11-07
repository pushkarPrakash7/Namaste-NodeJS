const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const userAuth = async (req, res, next) => {
    //Read the token from the req cookies
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            throw new Error("Invalid token");
        }
        const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
        const { _id } = decodedMessage;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json(error.message );
    }
}

module.exports = {userAuth};