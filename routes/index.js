const express = require('express');
const router = express.Router();
const getKeyStore = require('../jwt/keyStore.js').getKeyStore;
const jose = require('node-jose');
const bodyParser = require("body-parser");
const {hash, compare} = require("bcrypt");
const {generateJwtToken} = require("../jwt/generateJwtToken");


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

router.get('/token', async function (req, res) {
    const body = req.body;
    const token = await generateJwtToken(body);
    res.json({token: token});
});

module.exports = router;
