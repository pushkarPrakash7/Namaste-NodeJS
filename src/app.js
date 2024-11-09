const express = require('express');
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { validateSignUpData, validateEmail } = require("./utils/validation.js");
const { userAuth } = require("./middlewares/auth.js");
app.use(express.json());
app.use(cookieParser());
app.post('/signup', async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (error) {
        res.status(404).send(error.message);
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    res.send("Connection Request Sent");
    console.log(user.firstName+" "+user.lastName+" sent the connection request");
})

app.get("/user", userAuth, async (req, res) => {
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

// Connect to the database
connectDB().then(() => {
    console.log("Database connection established!");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((error) => {
    console.error("Database connection error!", error);
});