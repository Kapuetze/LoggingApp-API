var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var validator = require('express-validator');
var logger = require('morgan');
var cors = require('cors');
const _ = require('lodash');

// module variables
const config = require('./config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global.gConfig = finalConfig;

global.gBase_dir = __dirname;

var userRouter = require('./routes/user');
var logRouter = require('./routes/logs');
var containerRouter = require('./routes/container')

/* DB */
var dbUrl = 'mongodb://localhost:27017/';
var dbName = gConfig.database;
mongoose.connect(dbUrl + dbName, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`Database connected at ${dbUrl} :: ${dbName}`);
});

//passport strategies
require('./core/passport.js')

/* START EXPRESS SERVER */
var app = express();

//allow cross origin requests from angular app
app.use(cors({
    origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
    credentials: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(validator());

app.use('/user', userRouter);
app.use('/container', containerRouter);
app.use('/logs', logRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
