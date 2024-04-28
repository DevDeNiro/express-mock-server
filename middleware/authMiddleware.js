const jose = require('node-jose');
const {getKeyStore} = require("../jwt/keyStore");

const verifyJwtToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
    if (!token) {
        return res.status(401).json({error: 'Access denied. No token provided.'});
    }

    try {
        const keystore = await getKeyStore();
        const verifier = jose.JWS.createVerify(keystore);
        await verifier.verify(token);
        next();
    } catch (error) {
        res.status(400).json({error: 'Invalid token.'});
    }
};

module.exports = {verifyJwtToken};
