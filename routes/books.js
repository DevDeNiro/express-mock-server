const express = require('express');
const router = express.Router();
const {getKeyStore, jose, hash, compare, generateJwtToken} = require('../utils/utils');
const theLibrary = require("../models/books");

let books = theLibrary.reduce((acc, book) => {
    acc[book.id] = book;
    return acc;
}, {});

router.get('/', (req, res) => {
    try {
        res.json(Object.values(books));
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

router.post('/', (req, res) => {
    const {title, author, description, price, currency} = req.body;
    const newId = Math.max(0, ...Object.keys(books).map(Number)) + 1;
    books[newId] = {id: newId, title, author, description, price, currency};
    res.status(201).json({message: "Book created", book: books[newId]});
});

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {title, author, description, price, currency} = req.body;
    if (!books[id]) {
        return res.status(404).json({error: "Book not found"});
    }

    books[id] = {id, title, author, description, price, currency};
    res.json({message: "Book updated", book: books[id]});
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    if (!books[id]) {
        return res.status(404).json({error: "Book not found"});
    }

    delete books[id];
    res.json({message: "Book deleted"});
});

module.exports = router;
