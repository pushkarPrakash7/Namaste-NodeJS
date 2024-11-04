const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    emailId :{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age : {
        type: Number,
        required: true
    },
    gender : {
        type: String,
        required: true
    }
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;