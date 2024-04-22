const express = require('express');
const router = express.Router();
const User = require('../models/users');
const {hash, compare, generateJwtToken} = require('../utils/utils');
const {verifyJwtToken} = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");

function getDefaultJwtClaim(user) {
    if (user) {
        return {
            username: user.email,
            userId: user.id,
            authorities: user.authorities || ["AUTH_1"]
        };
    } else {

        return {
            "username": "test@test.com",
            "userId": 1,
            "authorities": ["AUTH_1"]
        };
    }
}

let TOKEN_TIMEOUT = 1000 * 60 * 5;


router.post('/auth/signup', async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({error: "Email and password are required"});
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
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

router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        // Check if a token was recently generated
        if (user.tokenGeneratedAt && (new Date() - user.tokenGeneratedAt) < TOKEN_TIMEOUT) {
            return res.status(409).send('A token has already been generated recently. Please wait.');
        }

        const tokenPayload = getDefaultJwtClaim(user)
        const token = await generateJwtToken(tokenPayload);
        user.tokenGeneratedAt = new Date();

        await user.save();

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


// M I D D L E W A R E
router.use(verifyJwtToken);

router.put('/users/:email/update', async (req, res) => {
    const { newName, newPassword } = req.body;
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (newPassword && newPassword.length >= 8) {
            user.password = await hash(newPassword, 10);
        } else if (newPassword) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }

        if (newName) {
            user.name = newName;
        }

        await user.save();
        res.json({ message: "User profile updated", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/users/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/users/:email', async (req, res) => {
    try {
        const result = await User.deleteOne({ email: req.params.email });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
