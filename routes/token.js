const {getKeyStore} = require("../jwt/keyStore");
const express = require('express');
const router = express.Router();
const {generateJwtToken} = require('../utils/utils');
const {getDefaultJwtClaim} = require('../jwt/getDefaultJwtClaim');
const {findOne} = require("../models/users");

router.get('/.well-known/jwks', async function (req, res) {
    const keys = await getKeyStore();
    res.json(keys.toJSON());
});

router.post('/', async function (req, res) {
    const body = req.body;
    const token = await generateJwtToken(body);
    res.json({token: token});
});

router.post('/refresh-token', async (req, res) => {
    const {email} = req.body;
    try {
        const user = await findOne({email});
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        const tokenPayload = getDefaultJwtClaim(user);
        const newToken = await generateJwtToken(tokenPayload);
        res.json({token: newToken});
    } catch (error) {
        console.error("Error refreshing token: ", error);
        res.status(500).json({error: 'Error refreshing token'});
    }
});

module.exports = router;
