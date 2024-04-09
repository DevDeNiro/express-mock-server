const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const app = express();

const indexRouter = require('./routes/index');
// view engine setup
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger('dev'));

app.use(cors());
app.use('/', indexRouter);

module.exports = app;
