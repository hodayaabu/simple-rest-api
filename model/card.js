const mongoose = require('mongoose');
const Joi = require('joi');
const _ = require('lodash');

//Schema for validation to db
const cardSchema = new mongoose.Schema({
    bizName: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true
    },
    bizAddress: {
        type: String,
        minlength: 2,
        maxlength: 255,
        required: true
    },
    bizPhone: {
        type: String,
        minlength: 9,
        maxlength: 10,
        required: true
    },
    bizDescription: {
        type: String,
        minlength: 2,
        maxlength: 1024,
        required: true
    },
    bizImage: {
        type: String,
        minlength: 2,
        maxlength: 1024,
        required: true
    },
    bizNumber: {
        type: String,
        minlength: 3,
        maxlength: 12,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});

//Add to the collection in db
const Card = mongoose.model('Card', cardSchema, 'cards');

//Validation with joi
function validateCard(card) {
    const schema = Joi.object({
        bizName: Joi.string().min(2).max(255).required(),
        bizAddress: Joi.string().min(2).max(255).required(),
        bizPhone: Joi.string().min(9).max(10).regex(/^0[2-9]\d{7,8}/).required(),
        bizDescription: Joi.string().min(2).max(1024).required(),
        bizImage: Joi.string().min(2).max(1024),
    });

    return schema.validate(card);
}

//Create a number for business cards
async function generateBizNumber() {
    while (true) {
        let randomNumber = _.random(1000, 999_999_999_999);
        const card = await Card.findOne({ bizNumber: randomNumber });
        if (!card) {
            return String(randomNumber);
        }
    }
}

module.exports = {
    Card,
    validateCard,
    generateBizNumber
}