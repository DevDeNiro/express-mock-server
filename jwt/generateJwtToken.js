const getKeyStore = require('../jwt/keyStore.js').getKeyStore;
const jose = require('node-jose');


async function generateJwtToken(payload) {
    const key = await getKeyStore();
    payload["iat"] = Math.floor(Date.now() / 1000);
    payload["exp"] = Math.floor(Date.now() / 1000) + 3600;

    return new Promise((resolve, reject) => {
        jose.JWS.createSign({alg: 'RS256', format: 'compact'}, key)
            .update(JSON.stringify(payload))
            .final()
            .then(token => {
                console.log("Generated Token: ", token);
                resolve(token);
            }, error => {
                console.error("Error generating token: ", error);
                reject(error);
            });
    });
}

module.exports = {generateJwtToken};

