'use strict';

var rp = require('request-promise');
var xml2js = require('xml2js');
var querystring = require('querystring');
var appConfig = require('../../config');

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
         * @param string
         * @return {*}
         */
        nlpQueryLogging: function (string) {
            var url = 'https://internal.trendata.com/nlplog/?' + querystring.stringify({
                sentence: Buffer.from(string).toString('base64'),
                client: appConfig.config.SERVER_NAME + '.trendata.com'
            });

            return rp(url);
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
