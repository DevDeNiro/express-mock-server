const jose = require('node-jose');
const keystore = jose.JWK.createKeyStore();

async function getKeyStore() {
    try {
        if (keystore.all().length === 0) {
            const key = await keystore.generate("RSA", 2048, {alg: "RS256", use: 'sig'})
            console.log("Key generated");
            return key;
        } else {
            console.log("Key already exists");
            return keystore.get();
        }
    } catch (error) {
        console.error("Error generating key: ", error);
        throw error;
    }
}

module.exports = {getKeyStore};
