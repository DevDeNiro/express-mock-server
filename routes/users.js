const express = require('express');
const router = express.Router();
const {getKeyStore, jose, hash, compare, generateJwtToken} = require('./index');
const users = {}


router.post('/api/signup', async (req, res) => {
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

router.post('/api/login', async (req, res) => {
    const {email, password} = req.body;
    const user = users[email];
    if (!user || !(await compare(password, user.password))) {
        return res.status(401).json({error: "Invalid email or password"});
    }

    const tokenPayload = {
        username: user.email,
        userId: 1,
        authorities: ["AUTH_1"]
    }

    const token = await generateJwtToken(tokenPayload);
    res.json({token: token});
});


router.put('/api/user/:email', async (req, res) => {
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

router.delete('/api/user/:email', (req, res) => {
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
