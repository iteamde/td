var config = require('./../../config').config;
var jwt = require('jsonwebtoken');
var UserModel = require('../models/orm-models').User;
var LoginDetailModel = require('../models/orm-models').LoginDetail;
var HttpResponse = require('./http-response');

/**
 * @param user
 * @returns {Promise}
 */
function getRootParentUser(user) {
    if (0 == user.trendata_user_created_by) {
        return Promise.resolve(user);
    }

    return UserModel.findByPrimary(user.trendata_user_created_by).then(function (parentUser) {
        return parentUser ? getRootParentUser(parentUser) : null;
    });
}

/**
 * Authorization middleware
 * @param req
 * @param res
 * @param next
 */
module.exports = function (req, res, next) {
    var authorization = req.header('Authorization');

    if (! authorization && ! req.xhr) {
        authorization = req.cookies.auth_token;
    }

    UserModel.findOne({
        include: [
            {
                model: LoginDetailModel,
                required: true,
                where: {
                    trendata_login_details_auth_token: authorization
                }
            }
        ]
    }).then(function (user) {
        if (! user) {
            throw new HttpResponse('unauthorized', 401);
        }
        jwt.verify(authorization, config.JWT_SECRET);
        req.user = user;
    }).then(function () {
        return getRootParentUser(req.user);

        /*if (req.user.trendata_user_created_by > 0 && req.user.trendata_user_id != req.user.trendata_user_created_by) {
            return UserModel.findByPrimary(req.user.trendata_user_created_by).then(function (user) {
                if (user) {
                    req.parentUser = user;
                } else {
                    req.parentUser = req.user;
                }
            });
        }

        req.parentUser = req.user;*/
    }).then(function (parentUser) {
        req.parentUser = parentUser;
    }).then(function () {
        next();
    }).catch(HttpResponse, function (err) {
        err.json(res);
    }).catch(function (err) {
        res.status(500).json(err.stack);
    });
};
