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

// Get token from email
router.post('/get-token', async (req, res) => {
    const {email} = req.body;
    try {
        const user = await findOne({email});
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        const tokenPayload = getDefaultJwtClaim(user);
        const token = await generateJwtToken(tokenPayload);
        res.json({token});
    } catch (error) {
        console.error("Error getting token: ", error);
        res.status(500).json({error: 'Error getting token'});
    }
})

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

router.post('/get-token', async (req, res) => {
    const {email} = req.body;
    try {
        const user = await findOne({email});
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        let token = getDefaultJwtClaim(email);
        res.json({token});
        // if (token && !isTokenExpired(token)) {
        //     console.log("Token still valid, returning existing token.");
        //     return res.json({token});
        // }
        //
        // // Si aucun token valide, générez un nouveau token
        // const tokenPayload = getDefaultJwtClaim(user);
        // token = await generateJwtToken(tokenPayload);
    } catch (error) {
        console.error("Error getting token: ", error);
        res.status(500).json({error: 'Error getting token'});
    }
});


module.exports = router;
