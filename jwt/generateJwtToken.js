const getKeyStore = require('../jwt/keyStore.js').getKeyStore;
const jose = require('node-jose');


async function generateJwtToken(payload) {
    const key = await getKeyStore();
    payload["iat"] = Math.floor(Date.now() / 1000);
    payload["exp"] = Math.floor(Date.now() / 1000) + 3600;

    return await new Promise((resolve, reject) => {
        jose.JWS.createSign({alg: 'RS256', format: 'compact'}, key)
            .update(JSON.stringify(payload))
            .final()
            .then(resolve, reject);
    });
}

module.exports = {generateJwtToken};

