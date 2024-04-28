const jose = require('node-jose');
const keystore = jose.JWK.createKeyStore();

async function getKeyStore() {
    try {
        if (keystore.all().length === 0) {
            return await keystore.generate("RSA", 2048, {alg: "RS256", use: 'sig'})
        } else {
            console.log("Key already exists");
            const keys = await keystore.all();
            return keys[0];
        }
    } catch (error) {
        console.error("Error generating key: ", error);
        throw error;
    }
}

module.exports = {getKeyStore};
