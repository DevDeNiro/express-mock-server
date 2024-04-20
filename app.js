const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const mongoose = require('mongoose');

const app = express();

const indexRouter = require('./routes/index');
// view engine setup
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger('dev'));

app.use(cors());
app.use('/', indexRouter);

mongoose.connect('mongodb://mongo:27017/express-mongo').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
});


module.exports = app;
