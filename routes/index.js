const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const booksRouter = require('./books');
const tokenRouter = require('./token');

router.use('/api/users', usersRouter);
router.use('/api/books', booksRouter);
router.use('/api/token', tokenRouter);

module.exports = router;
