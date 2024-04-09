const jose = require('node-jose');
const keystore = jose.JWK.createKeyStore();

async function getKeyStore() {
    if (keystore.all().length === 0) {
        return keystore.generate("RSA", 2048, {alg: "RS256", key_ops: ["sign"]})
    } else {
        return await keystore;
    }
}

module.exports = {getKeyStore};
