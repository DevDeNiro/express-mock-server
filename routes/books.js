const express = require('express');
const router = express.Router();
const {getKeyStore, jose, hash, compare, generateJwtToken} = require('../utils/utils');
const book = require("../models/books");

let books = {}

router.get('/', (req, res) => {
    res.json(Object.values(book));
});

router.post('/', (req, res) => {
    const {title, author, description, price, currency} = req.body;
    const id = Object.keys(books).length + 1;
    books[id] = {id, title, author, description, price, currency};
    res.status(201).json({message: "Book created", book: books[id]});
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
