require('dotenv').config();
require('./models/connection');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require('passport');
require('./config/passport');
const verifyAndRenewTokens = require('./middlewares/verifyAndRenewTokens');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var positionsRouter = require('./routes/positions');
var itinerariesRouter = require('./routes/itineraries');

const cors = require('cors');

var app = express();

app.use(cors());

app.use(verifyAndRenewTokens);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/positions', positionsRouter);
app.use('/itineraries', itinerariesRouter);

module.exports = app;
