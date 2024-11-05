const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 2,
        maxLength: 15,
    },
    lastName:{
        type: String,
        required: true,
        minLength: 2,
        maxLength: 15,
    },
    emailId :{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxLength: 30,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 20,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough");
            }
        }
    },
    age : {
        type: Number,
        required: true,
        min: 18,
        max: 99
    },
    gender : {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    photoURL : {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOtu74pEiq7ofeQeTsco0migV16zZoBwSlGg&s"
    },
    about: {
        type: String,
        default: "This describes the User"
    },
    skills: {
        type: [String],
    }
},{timestamps : true});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;