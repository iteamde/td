'use strict';

var orm = require('./orm/orm');
var ORM = require('sequelize');
var Builder = require('knex/lib/query/builder');
var Raw = require('knex/lib/raw');
Builder.prototype.then = then;
Raw.prototype.then = then;

/**
 * @return {Promise<*>}
 */
function then() {
    var sqlMethod = this.toSQL().method && this.toSQL().method.toUpperCase() || 'SELECT';
    var sqlQuery = this.toString();
    var result = orm.query(sqlQuery, {
        type: ORM.QueryTypes[sqlMethod]
    });

    return result.then.apply(result, arguments);
}

module.exports = require('knex')({
    dialect: 'mysql'
});
