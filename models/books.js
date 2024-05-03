const mongoose = require('mongoose');

const theLibrarySchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        author: {type: String, required: true},
        description: {type: String},
        price: {type: Number, required: true},
        currency: {type: String, required: true},
    }
);

const TheLibrary = mongoose.model('TheLibrary', theLibrarySchema);

module.exports = TheLibrary;