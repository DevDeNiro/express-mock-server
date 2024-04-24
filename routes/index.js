const express = require('express');
const router = express.Router();
const {verifyJwtToken} = require("../middleware/authMiddleware");

const authRouter = require('./auth');
const usersRouter = require('./users');
const booksRouter = require('./books');
const tokenRouter = require('./token');

// Public routes
router.use('/api/auth', authRouter);
router.use('/api/token', tokenRouter);

// Protected routes
router.use('/api/users', verifyJwtToken, usersRouter);
router.use('/api/books', verifyJwtToken, booksRouter);

module.exports = router;
