const jose = require('node-jose');
const {getKeyStore} = require("./keyStore");

const verifyJwtToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({error: 'Access denied. No token provided.'});
    }

    const _ = (() => ({
        alg: 'RS256',
        typ: 'JWT'
    }))

    try {
        const keystore = await getKeyStore();
        await jose.JWS.createVerify(keystore, _).verify(token);
        next();
    } catch (error) {
        res.status(400).json({error: 'Invalid token.'});
    }
};

module.exports = {verifyJwtToken};
