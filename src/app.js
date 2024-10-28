const express = require('express');

const app = express();

app.get("/user",(req,res)=>{
    res.send({firstName: "John", lastName: "Doe"});
})

app.post("/user",(req,res)=>{
    res.send("data successfully sent to the database!");
});

app.delete("/user",(req,res)=>{
    res.send("User deleted successfully!");
});

app.use("/test",(req,res)=>{
    res.send("Hello world from the testing in browser!");
});

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});