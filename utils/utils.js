const getKeyStore = require('../jwt/keyStore.js').getKeyStore;
const jose = require('node-jose');
const bcrypt = require("bcrypt");
const { generateJwtToken } = require("../jwt/generateJwtToken");

module.exports = {
    getKeyStore,
    jose,
    hash: bcrypt.hash,
    compare: bcrypt.compare,
    generateJwtToken,
};
