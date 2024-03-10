const express = require('express');
const router = express.Router();
const getKeyStore = require('../jwt/keyStore.js').getKeyStore;
const jose = require('node-jose');
const bodyParser = require("body-parser");
const {hash, compare} = require("bcrypt");
const {generateJwtToken} = require("../jwt/generateJwtToken");

// parse application/x-www-form-urlencoded
router.use(bodyParser.json());

// Simulate a database
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


router.get('/', function (req, res, next) {
    res.json({hello: "wordld!"});
});

router.get('/shutdown', function (req, res, next) {
    res.json({hello: "shutdown!"});
});

router.get('/.well-known/jwks.json', async function (req, res) {
    const keys = await getKeyStore();
    res.json(keys.toJSON());
});

router.post('/token', async function (req, res) {
    const body = req.body;
    const token = await generateJwtToken(body);
    res.json({token: token});
});

function getDefaultJwtClaim() {
    const index = process.argv.indexOf("--claims");
    const args = process.argv.slice(index + 1);
    if (args.length > 0) {
        return JSON.parse(args[0]);
    } else {
        return {
            "username": "test@test.com",
            "userId": 1,
            "authorities": ["AUTH_1"]
        };
    }
}

// router.options('/token', async function(req, res) {
//   console.log("============options")
//   const body = 'GET, POST, DELETE, PUT, PATCH';
//   res.set('Allow', body);
//   res.send(body);
// });

router.get('/token', async function (req, res) {
    const body = req.body;
    const token = await generateJwtToken(body);
    res.json({token: token});
});


module.exports = router;
