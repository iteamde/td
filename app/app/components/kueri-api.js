'use strict';

var config = require('../../config').config;
var rp = require('request-promise');
var xml2js = require('xml2js');
var querystring = require('querystring');
var appConfig = require('../../config');
var moment = require('moment');
var knex = require('../components/knex');

var xmlTemplates = {
    /**
     * Login XML
     */
    'server.login': _.template(
        `<methodCall xmlns:ex="http://ws.apache.org/xmlrpc/namespaces/extensions">
                <methodName>server.login</methodName>
                <params>
                    <param>
                        <value>
                            <string><%= login %></string>
                        </value>
                    </param>
                    <param>
                        <value>
                            <string><%= password %></string>
                        </value>
                    </param>
                </params>
            </methodCall>`
    ),

    /**
     *
     */
    'server.getKeywordSuggestions': _.template(
        `<methodCall xmlns:ex="http://ws.apache.org/xmlrpc/namespaces/extensions">
                <methodName>server.getKeywordSuggestions</methodName>
                <params>
                    <param>
                        <value>
                            <string><%= auth_token %></string>
                        </value>
                    </param>
                    <param>
                        <value>
                            <int><%= database_id %></int>
                        </value>
                    </param>
                    <param>
                        <value>
                            <string><%= query %></string>
                        </value>
                    </param>
                    <param>
                        <value>
                            <int><%= query_id %></int>
                        </value>
                    </param>
                </params>
            </methodCall>`
    ),

    /**
     *
     */
    'server.getSql': _.template(
        `<methodCall xmlns:ex="http://ws.apache.org/xmlrpc/namespaces/extensions">
                <methodName>server.getSql</methodName>
                <params>
                    <param>
                        <value>
                            <string><%= auth_token %></string>
                        </value>
                    </param>
                    <param>
                        <value>
                            <int><%= database_id %></int>
                        </value>
                    </param>
                    <param>
                        <value>
                            <string><%= query %></string>
                        </value>
                    </param>
                </params>
            </methodCall>`
    )
};

/**
 * <methodCall xmlns:ex="http://ws.apache.org/xmlrpc/namespaces/extensions">
 *     <methodName>server.getSql</methodName>
 *     <params>
 *         <param><value><string>ByEC8zmpJU</string></value></param>
 *         <param><value><int>5</int></value></param>
 *         <param><value><string>show user ordered by first name</string></value></param>
 *     </params>
 * </methodCall>
 */

/**
 *
 */
module.exports = function (commonConfig) {
    commonConfig = _.merge({
        api_url: 'http://127.0.0.1:8000',
        debug: false
    }, commonConfig);

    return {
        /**
         * @param token
         * @param raw
         * @param interpreted
         * @param resultFound
         * @param userId
         * @returns {Promise}
         */
        nlpQueryLoggingDetailed: function (token, raw, interpreted, resultFound, userId) {
            var data = Buffer.from(JSON.stringify({
                user_id: userId,
                raw: raw,
                interpreted: interpreted,
                result_found: resultFound,
                feedback: '',
                time: moment().format('YYYY-MM-DD HH:mm:ss')
            })).toString('base64');

            var url = 'https://internal.trendata.com/nlplog/?' + querystring.stringify({
                request_id: token,
                data: data,
                client: appConfig.config.SERVER_NAME + '.trendata.com'
            });

            return Promise.all([
                rp(url).catch(console.error),
                knex('trendata_kueri_log_detailed').insert({
                    trendata_kueri_log_detailed_token: token,
                    trendata_user_id: userId,
                    trendata_kueri_log_detailed_raw_string: raw,
                    trendata_kueri_log_detailed_interpreted_string: interpreted,
                    trendata_kueri_log_detailed_result_found: resultFound,
                    trendata_kueri_log_detailed_user_feedback: ''
                })
            ]);
        },

        /**
         * @returns {Promise}
         */
        getDataSourceId: function () {
            return knex('trendata_setting')
                .innerJoin(
                    'trendata_setting_value',
                    'trendata_setting.trendata_setting_id',
                    'trendata_setting_value.trendata_setting_id'
                )
                .where('trendata_setting.trendata_setting_name', 'kueri_datasource_id')
                .limit(1)
                .then(function (rows) {
                    return rows.length && parseInt(rows[0].trendata_setting_value, 10) || 11;
                });
        },

        /**
         * @returns {Promise}
         */
        updateDataSource: function () {
            var _this = this;

            return knex('trendata_setting')
                .innerJoin('trendata_setting_value', 'trendata_setting.trendata_setting_id', 'trendata_setting_value.trendata_setting_id')
                .whereIn('trendata_setting.trendata_setting_name', ['kueri_username', 'kueri_password'])
                .reduce(function (accum, item) {
                    accum[item.trendata_setting_name] = item.trendata_setting_value;
                    return accum;
                }, {}).then(function (kueriConfig) {
                    return _this.serverLogin({
                        login: kueriConfig.kueri_username,
                        password: kueriConfig.kueri_password
                    });
                }).then(function (data) {
                    return 'ok' === data.status ? data.token : Promise.reject(new Error(data.error.message));
                }).then(function (authToken) {
                    return rp({
                        rejectUnauthorized: false,
                        uri: 'https://nlp.techgenies.com/admin/restapi/datasource/refreshTables/' + config.SERVER_NAME,
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'User-Auth-Token': authToken
                        },
                        json: true
                    });
                }).tap(function (data) {
                    console.log('----------------------------------------------------------------------------------------');
                    console.log('Update DataSource:', config.SERVER_NAME);
                    console.log(data);
                }).catch(function (err) {
                    console.log('----------------------------------------------------------------------------------------');
                    console.log('Update DataSource error:', config.SERVER_NAME);
                    console.log(err);
                    return Promise.reject(err);
                });
        },

        /**
         * @param method
         * @param config
         * @return {Promise.<*>}
         */
        _common: function (method, config) {
            if (typeof xmlTemplates[method] !== 'function') {
                return Promise.reject(new Error('Kueri method not allowed'));
            }

            var xml = xmlTemplates[method](config);

            if (commonConfig.debug) {
                console.log(xml);
            }

            return rp({
                rejectUnauthorized: false,
                method: 'POST',
                uri: commonConfig.api_url,
                body: xml
            }).then(function (result) {
                return new Promise(function (resolve, reject) {
                    (new xml2js.Parser()).parseString(result, function (err, result) {
                        err ? reject(err) : resolve(result);
                    });
                });
            }).then(function (data) {
                var json = _.get(data, 'methodResponse.params[0].param[0].value[0]');

                return json ? JSON.parse(json) : {
                    status: 'error',
                    empty: true,
                    error: {
                        message: 'Empty result'
                    }
                };
            });
        },

        /**
         * @param config
         * @return {*|Promise.<*>}
         */
        serverLogin: function (config) {
            return this._common('server.login', config);
        },

        /**
         * @param config
         * @return {*|Promise.<*>}
         */
        serverGetKeywordSuggestions: function (config) {
            return this._common('server.getKeywordSuggestions', config);
        },

        /**
         * @param config
         * @return {*|Promise.<*>}
         */
        serverGetSql: function (config) {
            return this._common('server.getSql', config);
        }
    };
};
