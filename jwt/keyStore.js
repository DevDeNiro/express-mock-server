const jose = require('node-jose');
const keystore = jose.JWK.createKeyStore();

async function getKeyStore() {
    if (keystore.all().length === 0) {
        return keystore.generate("RSA", 2048, {alg: "RS256", use: 'sig'})
        console.log("Key generated");
    } else {
        console.log("Key already exists");
        return await keystore;
    }
}

module.exports = {getKeyStore};
