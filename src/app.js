const express = require('express');

const app = express();


app.use("/hello",(req,res)=>{
    res.send("Hello world from Node.js!");
})

app.use("/test",(req,res)=>{
    res.send("Hello world from the browser!");
});

app.use("/",(req, res)=>{
    res.status(404).send("Page not found");
});

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});