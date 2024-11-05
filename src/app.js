const express = require('express');
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const app = express();

app.use(express.json());
app.post('/signup', async (req, res) => {
    
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send('User added successfully');
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});


app.get("/user", async (req, res) => {
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

app.get("/feed", async (req, res) => {
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
app.delete("/user", async (req, res) => {
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
app.patch("/user", async (req, res) => {
    const id = req.body.userId;
    const data = req.body;
    const ALLOWED_UPDTAES = ["photoURL", "about", "gender", "age"]

    const isAllowedUpdate = Object.keys(data).every((k) =>
        ALLOWED_UPDTAES.includes(k));

    if(!isAllowedUpdate){
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
connectDB().then(() => {
    console.log("Database connection established!");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((error) => {
    console.error("Database connection error!", error);
});