const { User } = require('../model/user');

const bcrypt = require('bcrypt');
const Joi = require('joi');
const express = require('express');

const router = express.Router();

//Send token for user
router.post('/', async (req, res) => {
    try {
        const { error } = validateAuth(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }

        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(400).send("Sorry, this email is not exist :(");
            return;
        }

        const validatePassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validatePassword) {
            res.status(400).send("Sorry, invalid password:(");
            return;
        }

        const token = user.generateAuthToken();

        res.send({
            token,
        })
    } catch (err) {
        res.status(401).json({ err });
    }
})


function validateAuth(auth) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(7).max(255).required()
    });

    return schema.validate(auth);
}

module.exports = router;