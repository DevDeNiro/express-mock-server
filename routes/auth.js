const express = require('express');
const router = express.Router();
const { hash, compare, generateJwtToken } = require('../utils/utils');

// TODO: Shoud add store for users to share between routes
const users = {}

module.exports = router;
