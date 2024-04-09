const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');

const indexRouter = require('./routes');
const bodyParser = require("body-parser");

const app = express();

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use('/', indexRouter);

module.exports = app;
