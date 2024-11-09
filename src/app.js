const express = require('express');
const connectDB = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./router/auth.js");
const profileRouter = require("./router/profile.js");
const requestRouter = require("./router/requests.js");
const userRouter = require("./router/user.js");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


// Connect to the database
connectDB().then(() => {
    console.log("Database connection established!");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((error) => {
    console.error("Database connection error!", error);
});