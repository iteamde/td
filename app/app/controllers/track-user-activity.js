var config = require('./../../config').config;
var useragent = require('useragent');
var LoginDetailModel = require('../models/orm-models').LoginDetail;
var UserActivityModel = require('../models/orm-models').UserActivity;

/**
 * @param req
 * @param res
 */
module.exports = function (req, res) {
    var authorization = req.header('Authorization');
    var agent = useragent.parse(req.headers['user-agent']);

    if (! authorization && ! req.xhr) {
        authorization = req.cookies.auth_token;
    }

    LoginDetailModel.findOne({
        where: {
            trendata_login_details_auth_token: authorization
        }
    }).then(function (loginDetails) {
        return loginDetails ? loginDetails.trendata_login_details_user_id : null;
    }).then(function (userId) {
        return UserActivityModel.create({
            trendata_user_id: userId,
            trendata_user_activity_ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            trendata_user_activity_url: req.body && req.body.to || null,
            trendata_user_activity_referrer_page: req.body && req.body.from || null,
            trendata_user_activity_browser: agent.toAgent(),
            trendata_user_activity_session_id: authorization || null,
            trendata_user_activity_type: 'page-call'
        });
    }).then(function () {
        res.json({
            status: 'success'
        });
    }).catch(function (err) {
        res.status(500).send(err.stack);
    });
};
