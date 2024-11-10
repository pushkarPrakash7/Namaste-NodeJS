const validator = require("validator");

const validateSignUpData = (req) =>{
    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName){
        throw new Error('First name and last name are required.');
    }
    else if(!validator.isEmail(emailId)){
        throw new Error('Invalid email address.');
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error('Password is not strong enough.');
    }
}

const validateEmail = (req) =>{
    const {emailId} = req.body;
    if(!validator.isEmail(emailId)){
        throw new Error('Invalid email address.');
    }
}

const validatePassword = (req) =>{
    const isStrongPassword = validator.isStrongPassword(req);
    return isStrongPassword
}

const validateUserProfileUpdate = (req) =>{
    const allowedFields = ["firstName", "lastName", "emailId", "photoURL", "gender", "about", "skills" ]

    const isEditAllowed = Object.keys(req.body).every((field) => allowedFields.includes(field));
    return isEditAllowed;
}

module.exports = {validateSignUpData, validateEmail, validateUserProfileUpdate, validatePassword};