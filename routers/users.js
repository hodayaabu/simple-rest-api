const { User, validateUser } = require('../model/user');
const auth = require('../middleware/auth');

const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');

const router = express.Router();

//Add new user
router.post('/', async (req, res) => {
    try {
        const { error } = validateUser(req.body);

        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(400).send('user already exists');
            return;
        }

        user = new User(req.body);

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        res.send(_.pick(user, ['_id', 'name', 'email']));
    } catch (err) {
        res.status(401).json({ err });
    }
});

//Get user info
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        res.send(user);
    } catch (err) {
        res.status(401).json({ err });
    }
})


module.exports = router;