const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id}, 'DEV@Tinder$790', {expiresIn: '7d'});
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isMatch = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isMatch;
}

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;