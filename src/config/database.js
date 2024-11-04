const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://ispushkarjack0709:VK14D4z5nBXVzEZS@cluster0.3felr.mongodb.net/devTinder");
};

module.exports = connectDB;
