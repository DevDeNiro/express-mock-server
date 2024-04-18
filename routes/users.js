const express = require('express');
const router = express.Router();

const {hash, compare, generateJwtToken} = require('../utils/utils');
const {verifyJwtToken} = require("../middleware/authMiddleware");

const users = {}

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

router.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({error: "Email and password are required"});
    }
    if (users[email]) {
        return res.status(400).json({error: "User already exists"});
    }
    if (password.length < 8) {
        return res.status(400).json({error: "Password must be at least 8 characters"});
    }

    const hashedPassword = await hash(password, 10);
    console.log(`Creating user with email: ${email} and password: ${hashedPassword}`);
    users[email] = {email, password: hashedPassword};
    res.status(201).json({message: "User created"});
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = users[email];
    if (!user || !(await compare(password, user.password))) {
        return res.status(401).json({error: "Invalid email or password"});
    }

    const tokenPayload = getDefaultJwtClaim(user)

    const token = await generateJwtToken(tokenPayload);
    res.json({token: token});
});

// M I D D L E W A R E
router.use(verifyJwtToken);

router.put('/users/:email/update', async (req, res) => {
    const {email} = req.params;
    const {newName, newPassword} = req.body;
    const user = users[email];

    if (!user) {
        return res.status(404).json({error: "User not found"});
    }

    if (newPassword && newPassword.length >= 8) {
        user.password = await hash(newPassword, 10);
    } else if (newPassword) {
        return res.status(400).json({error: "Password must be at least 8 characters"});
    }

    if (newName) user.name = newName;

    res.json({message: "User profile updated", user: {email: user.email, name: user.name}});
});

router.delete('/users/:email', (req, res) => {
    const {email} = req.params;
    if (!users[email]) {
        return res.status(404).json({error: "User not found"});
    }

    delete users[email];
    res.json({message: "User deleted"});
});

router.get('/api/users', (req, res) => {
    const usersList = Object.keys(users).map(email => ({
        email: users[email].email,
        name: users[email].name,
    }));

    res.json(usersList);
});



module.exports = router;
