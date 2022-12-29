const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

//Schema for validation to db
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 7,
        maxlength: 255,
        required: true
    },
    biz: {
        type: Boolean,
        required: true
    },

});

//Create a token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, biz: this.biz }, config.get("jwtKey"));
}

//Add to the collection in db
const User = mongoose.model("User", userSchema, "users");


//Validation to node
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(7).max(255).required(),
        biz: Joi.boolean().required()
    });

    return schema.validate(user);
}

module.exports = {
    User,
    validateUser,
}