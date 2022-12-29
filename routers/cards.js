const { Card, validateCard, generateBizNumber } = require('../model/card');
const { validateCards } = require('../model/user');
const auth = require('../middleware/auth');

const express = require('express');
const router = express.Router();

//Add new card
router.post('/', auth, async (req, res) => {
    try {
        const { error } = validateCard(req.body);

        if (error) {
            res.status(401).send(error.details[0].message);
            return;
        }

        const card = new Card({
            ...req.body,
            bizImage: req.body.bizImage ? req.body.bizImage : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            bizNumber: await generateBizNumber(),
            userId: req.user._id
        });

        await card.save();

        res.send(card);
    } catch (err) {
        res.status(401).json({ err });
    }
});

//Get card by id
router.get('/:id', auth, async (req, res) => {
    try {
        const card = await Card.findById({ _id: req.params.id, userId: req.user._id });

        if (!card) {
            res.status(404).send('The card with the given id was not found');
            return;
        }

        res.send(card)
    } catch (err) {
        res.status(401).json({ err });
    }
});

//Update card by id 
router.put('/:id', auth, async (req, res) => {
    try {
        const { error } = validateCard(req.body);

        if (error) {
            res.status(401).send(error.details[0].message);
            return;
        }

        let card = await Card.findByIdAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body);

        if (!card) {
            res.status(404).send('The card with the given id was not found');
            return;
        }

        card = await Card.findOne({ _id: req.params.id, userId: req.user._id });

        res.send(card);
    } catch (err) {
        res.status(401).json({ err });
    }

});

//Delete card by id
router.delete("/:id", auth, async (req, res) => {
    try {
        const card = await Card.findByIdAndRemove({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!card) {
            res.status(404).send("The card with the given id was not found");
            return;
        }
        res.send(card);
    } catch (err) {
        res.status(401).json({ err });
    }
});


//Get all the user cards
router.get('/myCards/:id', auth, async (req, res) => {
    try {
        const cards = await Card.find({ userId: req.user._id });

        if (!req.params.id) {
            res.status(404).send('No user id provide');
            return;
        }
        res.send(cards)
    } catch (err) {
        res.status(401).json({ err });
    }
})

module.exports = router;