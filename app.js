require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var session = require('express-session')
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var methodOverride = require('method-override')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authorRouter = require('./routes/author');
var booksRouter = require('./routes/books');
var chatrouter = require('./routes/chat');
require('./libs/db-connection');
var app = express();

var io = require('socket.io')();
app.io = io;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// mongoose.Promise = global.Promise;
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.connect(process.env.MONGO_URL);

require('./config/passport');
app.use(session({
    secret: 'adsa897adsa98bs',
    resave: false,
    saveUninitialized: false,
}))

app.use(flash());
app.use(passport.initialize())
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json(({ limit: '50mb' }))); //request entrequest entity too largeity too large
app.use(express.urlencoded({ limit: '50mb', extended: false })); //request entrequest entity too largeity too large
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(methodOverride('_method'));

var socketRouter = require('./routes/socket')(io);
app.use('/', socketRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/authors', authorRouter);
app.use('/books', booksRouter);

app.use('/chat', chatrouter);

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