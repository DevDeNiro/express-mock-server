const express = require('express');
const router = express.Router();
const User = require('../models/users');
const {hash, compare, generateJwtToken} = require('../utils/utils');

router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.put('/:email/update', async (req, res) => {
    const {newName, newPassword} = req.body;
    try {
        const user = await User.findOne({email: req.params.email});
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        if (newPassword && newPassword.length >= 8) {
            user.password = await hash(newPassword, 10);
        } else if (newPassword) {
            return res.status(400).json({error: "Password must be at least 8 characters"});
        }

        if (newName) {
            user.name = newName;
        }

        await user.save();
        res.json({message: "User profile updated", user});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/:email', async (req, res) => {
    try {
        const user = await User.findOne({email: req.params.email});
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.delete('/:email', async (req, res) => {
    try {
        const result = await User.deleteOne({email: req.params.email});
        if (result.deletedCount === 0) {
            return res.status(404).json({error: "User not found"});
        }
        res.json({message: "User deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/whoami', async (req, res) => {
    try {
        const user = await User.findOne({email: req.user.email});
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        console.log(user);
        res.json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


module.exports = router;
