const express = require('express');
const router = express.Router();
const {hash, compare, generateJwtToken} = require('../utils/utils');
const User = require("../models/users");
const bcrypt = require("bcrypt");
const {getDefaultJwtClaim} = require('../jwt/getDefaultJwtClaim');

let TOKEN_TIMEOUT = 1000 * 60 * 5;

router.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({error: "Email and password are required"});
    }

    const existingUser = await User.findOne({email: email});
    if (existingUser) {
        return res.status(400).json({error: "User already exists"});
    }

    if (password.length < 8) {
        return res.status(400).json({error: "Password must be at least 8 characters"});
    }

    const hashedPassword = await hash(password, 10);
    console.log(`Creating user with email: ${email} and password: ${hashedPassword}`);
    const newUser = new User({email, password: hashedPassword});

    try {
        await newUser.save();
        res.status(201).json({message: "User created"});
    } catch (e) {
        console.error(e);
        res.status(500).json({error: "Error creating user"});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        // Check if a token was recently generated
        // if (user.tokenGeneratedAt && (new Date() - user.tokenGeneratedAt) < TOKEN_TIMEOUT) {
        //     return res.status(409).send('A token has already been generated recently. Please wait.');
        // }

        const tokenPayload = getDefaultJwtClaim(user)
        const token = await generateJwtToken(tokenPayload);
        user.tokenGeneratedAt = new Date();

        await user.save();

        res.json({token});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.post('/logout', async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).send('User not found');
        }
        user.tokenGeneratedAt = null;
        await user.save();
        res.send('Logged out');
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;
