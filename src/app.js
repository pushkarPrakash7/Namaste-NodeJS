const express = require('express');

const app = express();

app.get("/user",(req, res) =>{
    throw new Error("Not implemented");
    res.send("User Data sent");
})

app.use((err, req, res, next) => {
    if(err){
        //log your error messgae
        res.status(500).send(err.message);
    }
});
app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});