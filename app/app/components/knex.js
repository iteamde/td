'use strict';

var orm = require('./orm/orm');
var ORM = require('sequelize');
var KnexQueryBuilder = require('knex/lib/query/builder');
var Raw = require('knex/lib/raw');

/**
 * @return {Function}
 */
function runGetter() {
    var _this = this;

    /**
     * @param {Function} callback
     * @param {Object} options
     * @return {Function}
     */
    return function (/* callback, options */) {
        var sqlMethod = _this.toSQL().method && _this.toSQL().method.toUpperCase() || 'SELECT';
        var sqlQuery = _this.toString();
        var callback;
        var options = {};

        switch (arguments.length) {
            case 0:
                // Empty
                break;
            case 1:
                if (typeof arguments[0] === 'function') {
                    callback = arguments[0];
                } else if (null !== arguments[0] && typeof arguments[0] === 'object') {
                    options = arguments[0];
                }
                break;
            case 2:
            default:
                callback = arguments[0];
                options = arguments[1];
        }

        var promise = orm.query(sqlQuery, _.merge({
            type: ORM.QueryTypes[sqlMethod]
        }, options || {}));

        return callback ? promise.then(callback) : promise;
    }
}

KnexQueryBuilder.prototype.then = undefined;
Raw.prototype.then = undefined;

/**
 * KnexQueryBuilder
 */
Object.defineProperty(KnexQueryBuilder.prototype, 'run', {
    get: runGetter
});

/**
 * Raw
 */
Object.defineProperty(Raw.prototype, 'run', {
    get: runGetter
});

module.exports = require('knex')({
    dialect: 'mysql'
});
