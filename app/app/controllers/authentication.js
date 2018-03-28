var sendResponse = require('../libs/utils').sendResponse;
var passport = require('passport');
var generateJwt = require('../models/user').generateJwt;

var config = require('./../../config').config;
var db = require('../config/db');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var generatePassword = require('generate-password');
var HttpResponse = require('./../components/http-response');
var mailer = require('../components/mailer');
var apiCallTrack = require('../components/api-call-track');

var LoginDetailModel = require('../models/orm-models').LoginDetail;
var TranslationModel = require('../models/orm-models').Translation;
var LanguageModel = require('../models/orm-models').Language;
var UserModel = require('../models/orm-models').User;
var DashboardModel = require('../models/orm-models').Dashboard;

// Login user
module.exports.login = login;
module.exports.logout = logout;
module.exports.forgotPassword = forgotPassword;
module.exports.resetPassword = resetPassword;
module.exports.changePassword = changePassword;
module.exports.thirdPartyAuthorization = thirdPartyAuthorization;

/**
 * @param req
 * @param res
 */
function thirdPartyAuthorization(req, res) {
    var successJs = `<script type="application/javascript">
        window.localStorage.setItem('ngStorage-isAdmin', {is_admin});
        window.localStorage.setItem('ngStorage-trentoken', {trentoken});
        window.location.href = window.location.origin + '/#/dashboard/' + {dashboard_id};
    </script>`;

    apiCallTrack(function (trackApi) {
        if (!req.body.email || !req.body.password) {
            trackApi(req);
            return res.status(400).json({
                message: 'All fields required'
            });
        }

        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                trackApi(req, err);
                return res.status(500).send(err.stack);
            }

            if (user) {
                var dashboardID = 1;
                var token = generateJwt(user);
                DashboardModel.findOne({
                    where: {
                        trendata_user_id: user.trendata_user_id
                    }
                }).then(function (data) {
                    if (data)
                        dashboardID = data.trendata_dashboard_id;

                    LoginDetailModel.create({
                        trendata_login_details_auth_token: token,
                        trendata_login_details_ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress
                    }).then(function (loginDetail) {
                        return user.addLoginDetail(loginDetail);
                    }).then(function () {
                        trackApi(req);
                        res.cookie('auth_token', token, {
                            maxAge: 60 * 60 * 24 * 365 * 1000
                        }).send(
                            successJs.replace('{dashboard_id}', JSON.stringify(dashboardID))
                            .replace('{is_admin}', JSON.stringify((1 == user.trendata_user_id).toString()))
                            .replace('{trentoken}', JSON.stringify(JSON.stringify(token)))
                        );
                    }).catch(function (err) {
                        trackApi(req, err);
                        res.status(500).send(err.stack);
                    });
                }).catch(function (err) {
                    trackApi(req, err);
                    res.status(500).send(err.stack);
                });
            } else {
                trackApi(req, info);
                res.status(401).json(info);
            }
        })(req, res);
    });
}

/**
 * @param req
 * @param res
 */
function logout(req, res) {
    var authorization = req.header('Authorization');

    if (!authorization && !req.xhr) {
        authorization = req.cookies.auth_token;
    }

    LoginDetailModel.findOne({
        trendata_login_details_auth_token: authorization,
        trendata_login_details_user_id: req.user.trendata_user_id
    }).then(function (loginDetail) {
        if (loginDetail) {
            return loginDetail.destroy();
        }
    }).then(function () {
        res.clearCookie('auth_token').json({
            success: true
        });
    }).catch(function (err) {
        res.status(500).send(err.stack);
    });
}

var translationData;
function getTranslationData() {
    var lngId = 1;

    Promise.resolve().then(function () {
        return Promise.props({
            main: TranslationModel.findAll({
                include: [
                    {
                        model: LanguageModel,
                        required: true,
                        where: {
                            trendata_language_id: lngId
                        }
                    }
                ]
            }),
            en: 1 == lngId ? [] : TranslationModel.findAll({
                include: [
                    {
                        model: LanguageModel,
                        required: true,
                        where: {
                            trendata_language_id: 1
                        }
                    }
                ]
            })
        });
    }).then(function (data) {
        return Promise.props({
            main: Promise.reduce(data.main, function (result, item) {
                result[item.trendata_translation_token] = item.trendata_translation_text;
                return result;
            }, {}),
            en: Promise.reduce(data.en, function (result, item) {
                result[item.trendata_translation_token] = item.trendata_translation_text;
                return result;
            }, {})
        });
    }).then(function (data) {
        translationData = _.merge(data.en, data.main);
    }).catch(function (err) {
        return err;
    });
}
getTranslationData();
/**
 * @param req
 * @param res
 */
function login(req, res) {
    apiCallTrack(function (trackApi) {
        if (!req.body.email || !req.body.password) {
            trackApi(req);
            return res.status(400).json({
                message: 'All fields required'
            });
        }

        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                trackApi(req, err);
                return res.status(500).send(err.stack);
            }

            if (user) {
                var dashboardID = 1;
                var token = generateJwt(user);
                DashboardModel.findOne({
                    where: {
                        trendata_user_id: user.trendata_user_id
                    }
                }).then(function (data) {
                    if (data)
                        dashboardID = data.trendata_dashboard_id;
                    
                    LoginDetailModel.create({
                        trendata_login_details_auth_token: token,
                        trendata_login_details_ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress
                    }).then(function (loginDetail) {
                        return user.addLoginDetail(loginDetail);
                    }).then(function () {
                        trackApi(req);
                        res.cookie('auth_token', token, {
                            maxAge: 60 * 60 * 24 * 365 * 1000
                        }).json({
                            token: token,
                            version: config.APP_VERSION,
                            is_admin: 1 == user.trendata_user_id,
                            dashboardId: dashboardID,
                            user: user
                        });
                    }).catch(function (err) {
                        trackApi(req, err);
                        res.status(500).send(err.stack);
                    });
                }).catch(function (err) {
                    trackApi(req, err);
                    res.status(500).send(err.stack);
                });
            } else {
                trackApi(req, info);
                res.status(401).json(info);
            }
        })(req, res);
    });
}

/**
 * @param req
 * @param res
 */
function forgotPassword(req, res) {
    apiCallTrack(function (trackApi) {
        var email = req.body.email;

        UserModel.findOne({
            where: {
                trendata_user_email: email
            }
        }).then(function (user) {
            if (!user || +user.trendata_user_status === 2) {
                throw new HttpResponse({
                    message: 'User not found'
                }, 404);
            }

            var newPassword = generatePassword.generate({
                length: 15,
                numbers: true
            });

            user.setPassword(newPassword);

            return user.save().then(function () {
                return {
                    email: user.trendata_user_email,
                    newPassword: newPassword
                };
            });
        }).then(function (data) {
            return mailer({
                to: data.email,
                subject: 'Reset password',
                html: 'Your password has been reset!<br> New password: <strong>' + data.newPassword + '</strong>'
            });
        }).then(function () {
            trackApi(req);
            res.json({
                messgae: 'Success'
            });
        }).catch(HttpResponse, function (err) {
            trackApi(req);
            err.json(res);
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).json({
                message: err.stack
            });
        });
    });
}

/* RESET_PASSWORD
 ================================================================ **/

/**
 * @param req
 * @param res
 */
function resetPassword(req, res) {
    apiCallTrack(function (trackApi) {
        async.waterfall([
            function (done) {
                var query, query2, id,
                        user, userId, token, salt, hashedPassword;

                query = "SELECT * FROM `trendata_user` WHERE `trendata_user_reset_password_token` = '" + req.params.token + "'";

                db.get().query(query, function (err, rows) {
                    if (err) {
                        throw err;
                    }

                    if (!rows.length) {
                        return sendResponse(res, 400, {
                            "message": "Password reset token is invalid or has expired."
                        });
                    }

                    user = rows[0];
                    userId = rows[0].trendata_user_id;

                    if ((Date.now()) > user.reset_password_expiry) {
                        return sendResponse(res, 400, {
                            "message": "Password reset token is invalid or has expired."
                        });
                    }

                    query2 = "UPDATE trendata_user SET trendata_user_salt = ?, trendata_user_password = ?, trendata_user_reset_password_token = ?, trendata_user_reset_password_expiry = ? WHERE trendata_user_id = ?";
                    salt = crypto.randomBytes(16).toString('hex');
                    hashedPassword = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha1').toString('hex');
                    db.get().query(query2, [salt, hashedPassword, "", "", userId], function (err, rows) {
                        if (err)
                            throw err;
                        done(err, user);
                    });
                });
            },
            function (user, done) {
                mailer({
                    to: user.trendata_user_email,
                    //from: 'passwordreset@demo.com',
                    subject: translationData['password_changed'],
                    text: eval(translationData['password_changed_email_text'])
                }).then(function () {
                    done();
                }).catch(done);

                // var transport = nodemailer.createTransport("SMTP", {
                //     host: 'localhost',
                //     port: 25,
                //     secure:true,
                //     ignoreTLS:false,
                //     debug:false
                // });
                //
                // var mailOptions = {
                //     to: user.trendata_user_email,
                //     from: 'passwordreset@demo.com',
                //     subject: translationData['password_changed'],
                //     text: eval(translationData['password_changed_email_text'])
                // };
                //
                // transport.sendMail(mailOptions, function (err) {
                //     if (err) {
                //         return sendResponse(res, 400, {
                //             "message": err
                //         });
                //     } else {
                //         return sendResponse(res, 200, {
                //             "message": "Success! Your password has been changed."
                //         });
                //     }
                //
                //     done(err);
                //     transport.close();
                // });
            }
        ], function (err) {
            trackApi(req, err);
            res.redirect('/');
        });
    });
}

/* CHANGE PASSWORD
 ================================================================ **/

/**
 * @param req
 * @param res
 */
function changePassword(req, res) {
    if (!req.body.currentPassword || !req.body.newPassword || !req.body.confirmNewPassword)
        return res.status(400).json(translationData['all_fields_required']);

    if (req.body.newPassword !== req.body.confirmNewPassword)
        return res.status(400).json(translationData['passwords_not_match']);

    if (req.body.newPassword.length < 6)
        return res.status(400).json(translationData['password_too_short']);

    UserModel.findOne({
        where: {
            trendata_user_id: req.body.id
        }
    }).then(function (user) {
        if (!user) {
            throw new HttpResponse({
                message: 'User not found'
            }, 404);
        }

        if (!user.validatePassword(req.body.currentPassword))
            return res.status(400).json(translationData['incorrect_password']);

        user.setPassword(req.body.newPassword);

        return user.save();
    })
            .then(function () {
                res.json({
                    messgae: 'success'
                });
            })
            .catch(HttpResponse, function (err) {
                err.json(res);
            }).catch(function (err) {
        res.status(500).json({
            message: err.stack
        });
    });
}
