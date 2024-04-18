const express = require('express');
const router = express.Router();

// const authRouter = require('./auth');
const usersRouter = require('./users');
const booksRouter = require('./books');
const tokenRouter = require('./token');

// router.use('/api', authRouter);
router.use('/api', usersRouter);
router.use('/api/books', booksRouter);
router.use('/api/token', tokenRouter);

module.exports = router;
