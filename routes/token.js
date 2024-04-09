const {getKeyStore} = require("../jwt/keyStore");
// const {generateJwtToken} = require("../jwt/generateJwtToken");
const express = require('express');
const router = express.Router();
const {generateJwtToken} = require('../utils/utils');


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

router.get('/token', async function (req, res) {
    const body = req.body;
    const token = await generateJwtToken(body);
    res.json({token: token});
});

module.exports = router;
