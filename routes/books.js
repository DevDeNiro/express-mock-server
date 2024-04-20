const express = require('express');
const router = express.Router();
const {getKeyStore, jose, hash, compare, generateJwtToken} = require('../utils/utils');
const TheLibrary = require("../models/books");

router.get('/', async (req, res) => {
    try {
        const books = await TheLibrary.find({});
        res.json(books);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

router.post('/', async (req, res) => {
    const {title, author, description, genre, year, price, currency} = req.body;
    const book = new TheLibrary({title, author, description, genre, year, price, currency});
    try {
        await book.save();
        res.status(201).json({message: "Book created", book});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {title, author, description, genre, year, price, currency} = req.body;
    try {
        const book = await TheLibrary.findByIdAndUpdate(id, {title, author, description, genre, year, price, currency}, {new: true});
        if (!book) {
            return res.status(404).json({error: "Book not found"});
        }
        res.json({message: "Book updated", book});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const result = await TheLibrary.findByIdAndDelete(id);
        if (result === null) {
            return res.status(404).json({error: "Book not found"});
        }
        res.json({message: "Book deleted"});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

module.exports = router;
