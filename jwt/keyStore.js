const jose = require('node-jose');
const keystore = jose.JWK.createKeyStore();

function getKeyStore() {
  if (keystore.all().length === 0) {
    return keystore.generate("RSA", 2048, {alg:"RS256", key_ops:["sign"]}).
      then(function(result) {
      let key = result;
      }).then((k) => {
        return keystore.generate("RSA", 2048, {alg:"RS256", key_ops:["sign"]})
      }).then((k) => {
        return keystore;
      });
  } else {
    return Promise.resolve(keystore);
  }
}

module.exports = {getKeyStore: getKeyStore};
