// require('dotenv').load();
//require
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var config = require('./config').config;
var http_status = require('./app/config/constant').HTTP_STATUS;
var routes = require('./app/routes/index');
var cron = require('node-cron');
var alert = require('./app/controllers/alert');
var moment = require('moment');
var app = express();

require('./app/models/orm-models');

console.log(config.SERVER_NAME);
/* REQUIRED FOR ALL PROJECTS -- BEGIN */
if(config.SERVER_NAME !=='localhost')
{
var NODE_ENV_NAME = config.SERVER_NAME; /* <---- CHANGE THIS TO PROJECT NAME */
    var NODE_ENV_SOCKET='/var/www/'+NODE_ENV_NAME+'/run/node.socket';
    var server = app.listen( NODE_ENV_SOCKET, function () {
        var exec = require( "child_process").exec;
        exec("chown .www-data "+NODE_ENV_SOCKET);
        exec("chmod 770 "+NODE_ENV_SOCKET);
    });

var gracefulShutdown = function() {
    console.log("Received kill signal, shutting down gracefully.");

    server.close(function() {
        console.log("Closed out remaining connections.");
        process.exit();
        // if after
        setTimeout(function() {
            console.error("Could not close connections in time, forcefully shutting down");
            process.exit();
        }, 10000);
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
}
/* REQUIRED FOR ALL PROJECTS -- END */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '1024mb'
}));
app.use(bodyParser.urlencoded({
    limit: '1024mb',
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'resources')));

/*
 * Cross Domain
 */
app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});

// create db connection on app.js
var db = require('./app/config/db');

// Connect to MySQL on start
db.connect(db.MODE_PRODUCTION, function (err) {

    if (err) {
        console.log('Unable to connect to MySQL.');
        process.exit(1)
    } else {
        console.log('MYSQL DB connection setup successfully!');
    }

});

// passport configuration
//require('./app/config/passport');
require('./app/config/passport')(passport); // pass passport for configuration

// required for passport
//app.use(session({
//    secret: 'vidyapathaisalwaysrunning',
//    resave: true,
//    saveUninitialized: true
//} )); // session secret
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/api', routes);

app.get('*', function(req, res) {
    console.log("Calling to root");
    res.sendFile('./public'); // load the single view file (angular will handle the page changes on the front-end)
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = http_status.bad_request;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

// day
cron.schedule('0 0 * * *', function() {
    let today = moment().format('YYYY-MM-DD');
    alert.checkAlerts(1, moment(today).startOf('day').utc().format('X'));
});

// week
cron.schedule('0 0 * * Mon', function() {
    alert.checkAlerts(1, 'week');
});

// month
cron.schedule('0 0 1 * *', function() {
    alert.checkAlerts(1, 'month');
});

// quarter
cron.schedule('0 0 1 */3 *', function() {
    alert.checkAlerts(1, 'quarter');
});