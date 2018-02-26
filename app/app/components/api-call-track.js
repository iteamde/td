var LoginDetailModel = require('../models/orm-models').LoginDetail;
var UserActivityModel = require('../models/orm-models').UserActivity;
var useragent = require('useragent');

module.exports = function (cb) {
    return new Promise(function (resolve, reject) {
        var startTime = Date.now();

        cb(function (req, error) {
            error = error && error.stack || error && JSON.stringify(error) || null;
            var executionTime = Date.now() - startTime;
            var authorization = req.header('Authorization');
            var agent = useragent.parse(req.headers['user-agent']);

            if (! authorization && ! req.xhr) {
                authorization = req.cookies.auth_token;
            }

            Promise.resolve().then(function () {
                if (authorization) {
                    return LoginDetailModel.findOne({
                        where: {
                            trendata_login_details_auth_token: authorization
                        }
                    }).then(function (loginDetails) {
                        return loginDetails ? loginDetails.trendata_login_details_user_id : null;
                    });
                }
                return null;
            }).then(function (userId) {
                return UserActivityModel.create({
                    trendata_user_id: userId,
                    trendata_user_api_execution_time: executionTime,
                    trendata_user_api_error_message: error,
                    trendata_user_activity_browser: agent.toAgent(),
                    trendata_user_activity_ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                    trendata_user_activity_url: req.originalUrl,
                    trendata_user_activity_session_id: authorization || null,
                    trendata_user_activity_type: 'api-call'
                });
            }).then(resolve).catch(reject);
        });
    });
};
