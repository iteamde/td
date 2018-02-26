var mysql = require('mysql')
    , async = require('async');

var config = require('./../../config').config;


var PRODUCTION_DB = 'trendata_presentaion'
    , TEST_DB = 'trendata_test';

exports.MODE_DEV = 'mode_dev';
exports.MODE_PRODUCTION = 'mode_production';

var state = {
    pool: null,
    mode: null
};

exports.connect = function (mode, done) {
    state.pool = mysql.createPool({
        host:config.DB_HOST,// mode === exports.MODE_PRODUCTION ? process.env.DB_PRODUCTION_HOST : process.env.DB_DEV_HOST,
        port: config.DB_PORT,// mode === exports.MODE_PRODUCTION ? process.env.DB_PRODUCTION_PORT : process.env.DB_DEV_PORT,
        user: config.DB_USER,//mode === exports.MODE_PRODUCTION ? process.env.DB_PRODUCTION_USER : process.env.DB_DEV_USER,
        password: config.DB_PASSWORD,// mode === exports.MODE_PRODUCTION ? process.env.DB_PRODUCTION_PASSWORD : process.env.DB_DEV_PASSWORD,
        database: config.DB_NAME//mode === exports.MODE_PRODUCTION ? process.env.DB_PRODUCTION : process.env.DB_DEV
    });


    state.mode = mode;
    done();
};

exports.get = function () {
    return state.pool
};

exports.fixtures = function (data) {
    var pool = state.pool;
    if (!pool) return done(new Error('Missing database connection.'));

    var names = Object.keys(data.tables);
    async.each(names, function (name, cb) {
        async.each(data.tables[name], function (row, cb) {
            var keys = Object.keys(row)
                , values = keys.map(function (key) {
                return "'" + row[key] + "'"
            });

            pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb)
        }, cb)
    }, done)
};

exports.drop = function (tables, done) {
    var pool = state.pool;
    if (!pool) return done(new Error('Missing database connection.'));

    async.each(tables, function (name, cb) {
        pool.query('DELETE * FROM ' + name, cb);
    }, done)
};