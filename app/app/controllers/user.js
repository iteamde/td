/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var fs = require('fs');
var multer = require('multer');
var url = require('url');

var sendResponse = require('../libs/utils').sendResponse;
var HttpResponse = require('../components/http-response');

var db = require('../config/db');
var commonModel = require('../models/common');
var userModel = require('../models/user');

var http_status = require('../config/constant').HTTP_STATUS;
var async = require('async');
require('../config/global');
require('../libs/utils');
var crypto = require('crypto');
var generator = require('generate-password');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var mailer = require('../components/mailer');
var apiCallTrack = require('../components/api-call-track');

var UserModel = require('../models/orm-models').User;
var LanguageModel = require('../models/orm-models').Language;
var UserActivityModel = require('../models/orm-models').UserActivity;
var UsersGridSettingsModel = require('../models/orm-models').UsersGridSettings;

module.exports = {
    getUserList: getUserList,
    getUser: getUser,
    addNewUser: addNewUser,
    editUser: editUser,
    uploadImage: uploadImage,
    suspendUser: suspendUser,
    deleteUser: deleteUser,
    activateUser:activateUser,
    saveUsersGridSettings:saveUsersGridSettings
};

//module.exports.getUserList = getUserList;
//module.exports.addNewUser = addNewUser;
//module.exports.uploadImage = uploadImage;
//module.exports.suspendUser = suspendUser;
//module.exports.deleteUser = deleteUser;
//module.exports.editUser = editUser;

function fullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host')
  });
}

/**
 *
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 * return as response json of user details
 */
function getUserList(req, res) {
    apiCallTrack(function (trackApi) {
        var sort = req.query.sort || '';
        var columns = {
            firstname: 'trendata_user_firstname',
            email: 'trendata_user_email',
            designation: 'trendata_user_designation',
            status: 'trendata_user_status'
        };

        var order = [];

        if ('' != sort) {
            if (sort.indexOf('-') === 0) {
                order.push([columns[sort.substring(1)], 'DESC']);
            } else {
                order.push([columns[sort], 'ASC']);
            }
        }

        UserModel.findAndCountAll({
            where: {
                trendata_user_status: {
                    $ne: '2'
                }
            },
            limit: parseInt(req.query.limit || 10),
            offset: parseInt(req.query.offset || 0),
            order: order,
            include: [
                {
                    model: LanguageModel,
                    required: false
                }
            ]
        }).then(function (result) {
            return Promise.props({
                data: Promise.map(result.rows, function (item) {
                    return {
                        id:             item.trendata_user_id,
                        name:           item.trendata_user_firstname + ' ' + item.trendata_user_lastname,
                        firstname:      item.trendata_user_firstname,
                        lastname:       item.trendata_user_lastname,
                        email:          item.trendata_user_email,
                        dob:            item.trendata_user_dob,
                        createdOn:      item.created_at,
                        designation:    item.trendata_user_designation,
                        status:         item.trendata_user_status,
                        language_id:    item.Language.trendata_language_id,
                        language_key:   item.Language.trendata_language_key,
                        language_title: item.Language.trendata_language_title
                    }
                }),
                total: result.count
            });
        }).then(function (data) {
            trackApi(req);
            res.json(data);
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).json(err.stack);
        });
    });
}

/**
 * @param req
 * @param res
 */
function getUser(req, res) {
    apiCallTrack(function (trackApi) {
        UserModel.findOne({
            where: {
                trendata_user_id: req.params.id
            },
            include: [
                {
                    model: LanguageModel,
                    required: true
                }
            ]
        }).then(function (user) {
            if (! user) {
                return Promise.reject(new HttpResponse('User not found', 404));
            }

            res.json({
                user_id:        user.trendata_user_id,
                firstname:      user.trendata_user_firstname,
                lastname:       user.trendata_user_lastname,
                name:           user.trendata_user_firstname + ' ' + user.trendata_user_lastname,
                email:          user.trendata_user_email,
                designation:    user.trendata_user_designation,
                status:         user.trendata_user_status
            });
        }).catch(HttpResponse, function (err) {
            trackApi(req);
            err.json(res);
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).send(err.stack);
        });
    });
}

/**
 *
 */
function mappedUserDbValue(val)
{
    var jsonTemp = {};
    jsonTemp["id"] = val.trendata_user_id;
    jsonTemp["firstname"] = val.trendata_user_firstname;

    jsonTemp["lastname"] = val.trendata_user_lastname;
    jsonTemp["email"] = val.trendata_user_email;
    jsonTemp["dob"] = val.trendata_user_dob;
    jsonTemp["createdOn"] = val.trendata_user_created_on;
    jsonTemp["designation"] = val.trendata_user_designation;
    jsonTemp["status"] = val.trendata_user_status;
    jsonTemp["language_id"] = val.trendata_user_language_id;
    jsonTemp["language_key"] = val.trendata_language_key;

    jsonTemp["language_title"] = val.trendata_language_title;
    return jsonTemp;
}

/**
 * @param req
 * @param res
 */
function addNewUser(req, res) {
    apiCallTrack(function (trackApi) {
        var firstname   = req.body.firstname || req.body.lastname;
        var lastname    = req.body.lastname;
        var designation = req.body.designation || '';
        var image       = '';
        var email       = req.body.email;
        var status      = req.body.status;
        var user_id     = null;

        if (!firstname || !lastname || !email) {
            trackApi(req);
            return res.status(400).json('Required parameter missing');
        }

        UserModel.count({
            where: {
                trendata_user_email: email
            }
        }).then(function (count) {
            if (count) {
                throw new HttpResponse('User already exists', 400);
            }
        }).then(function () {
            var password = generator.generate({
                length: 15,
                numbers: true
            });
            var currentDateTime = global.getGMTDateTime();
            var salt = crypto.randomBytes(16).toString('hex');
            var hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha1').toString('hex');

            return UserModel.create({
                trendata_user_firstname:                firstname,
                trendata_user_middlename:               firstname + ' - ' + lastname,
                trendata_user_lastname:                 lastname,
                trendata_user_email:                    email,
                trendata_user_dob:                      '1990-01-01',
                trendata_user_status:                   status,
                trendata_user_designation:              designation,
                trendata_user_profile_image:            image,
                trendata_user_created_by:               req.user.trendata_user_id,
                trendata_user_salt:                     salt,
                trendata_user_password:                 hashedPassword,
                trendata_user_created_on:               currentDateTime,
                trendata_user_reset_password_token:     '',
                trendata_user_reset_password_expiry:    '',
                trendata_user_language_id:              1
            }).then(function (user) {
                getEmailSubjectAndMessageText('welcome_email',function(err, emailResult){
                    var message = emailResult.message;
                    var subject = emailResult.subject;
                    message = message.replace(/<firstname>/g, user.trendata_user_firstname); 
                    message = message.replace(/<lastname>/g, user.trendata_user_lastname); 
                    message = message.replace(/<username>/g, '<strong>' + user.trendata_user_email + '</strong>'); 
                    message = message.replace(/<password>/g, '<strong>' + password + '</strong>');
                    message = message.replace(/<siteurl>/g, '<a href='+ fullUrl(req) +'>' + fullUrl(req) +'</a>');
                    message = message.replace(/(?:\r\n|\r|\n)/g, '<br />');
                    mailer({
                        to: user.trendata_user_email,
                        subject: subject,
                        html: message
                    });
                });
                return user;
            });
        }).then(function (user) {
            trackApi(req);
            res.json({
                id:             user.trendata_user_id,
                firstname:      user.trendata_user_firstname,
                lastname:       user.trendata_user_lastname,
                name:           user.trendata_user_firstname + ' ' + user.trendata_user_lastname,
                email:          user.trendata_user_email,
                dob:            user.trendata_user_dob,
                createdOn:      user.created_at,
                designation:    user.trendata_user_designation,
                status:         user.trendata_user_status,
                language_id:    user.trendata_user_language_id,
                language_key:   user.trendata_language_key,
                language_title: user.trendata_language_title
            });
        }).catch(HttpResponse, function (err) {
            err.json(res);
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).send(err.stack);
        });
    });
}



/**
 *
 * @param {type} req
 * @param {type} res
 * @returns {undefined}update user through administrator
 */
function editUser(req, res) {
    apiCallTrack(function (trackApi) {
        var firstname   = req.body.firstname;
        var lastname    = req.body.lastname;
        var designation = req.body.designation;
        var email       = req.body.email;
        var user_id     = req.body.user_id;
        var status      = req.body.status;

        if (! firstname || ! lastname || ! email || ! user_id || ! status) {
            return res.status(400).json('Required parameter missing');
        }

        UserModel.findOne({
            where: {
                trendata_user_id: user_id
            },
            include: [
                {
                    model: LanguageModel,
                    required: true
                }
            ]
        }).then(function (user) {
            if (! user) {
                return Promise.reject(new HttpResponse('User not found', 404));
            }
            return user;
        }).then(function (user) {
            return UserModel.count({
                where: {
                    trendata_user_email: email,
                    trendata_user_id: {
                        $ne: user_id
                    }
                }
            }).then(function (count) {
                if (count) {
                    return Promise.reject(new HttpResponse('This email is already in use', 400));
                }
                return user;
            });
        }).then(function (user) {
            return user.update({
                trendata_user_firstname: firstname,
                trendata_user_lastname: lastname,
                trendata_user_email: email,
                trendata_user_status: status,
                trendata_user_designation: designation || '',
                trendata_user_last_modified_by: req.user.trendata_user_id
            }).then(function () {
                return user;
            });
        }).then(function (user) {
            res.json({
                id: user.trendata_user_id,
                firstname: user.trendata_user_firstname,
                lastname: user.trendata_user_lastname,
                name: user.trendata_user_firstname + ' ' + user.trendata_user_lastname,
                email: user.trendata_user_email,
                dob: user.trendata_user_dob,
                createdOn: user.created_at,
                designation: user.trendata_user_designation,
                status: user.trendata_user_status,
                language_id: user.trendata_user_language_id,
                language_key: user.Language.trendata_language_key,
                language_title: user.Language.trendata_language_title
            });
        }).catch(HttpResponse, function (err) {
            trackApi(req);
            err.json(res);
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).send(err.stack);
        });
    });
}




/**
 * Suspend the user
 * change the status as 0
 */
function suspendUser(req, res) {
    apiCallTrack(function (trackApi) {
        var status = '0';

        if (! req.body.user_id) {
            trackApi(req);
            return res.status(400).json('Required Parameter Missing');
        }

        var user_ids = req.body.user_id;

        UserModel.update({
            trendata_user_status: status
        }, {
            where: {
                trendata_user_id: user_ids
            }
        }).spread(function (affectedCount, affectedRows) {
            trackApi(req);
            res.json({
                user_id: user_ids,
                user_status: status
            });
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).send(err.stack);
        });
    });
}
/**
 * activate the user
 * change the status as 1
 */
function activateUser(req, res) {
    apiCallTrack(function (trackApi) {
        var status = '1';

        if (! req.body.user_id) {
            trackApi(req);
            return res.status(400).json('Required Parameter Missing');
        }

        var user_ids = req.body.user_id;

        UserModel.update({
            trendata_user_status: status
        }, {
            where: {
                trendata_user_id: user_ids
            }
        }).spread(function (affectedCount, affectedRows) {
            trackApi(req);
            res.json({
                user_id: user_ids,
                user_status: status
            });
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).send(err.stack);
        });
    });
}

/**
 * Delete user
 * change the status as 2
 */
function deleteUser(req, res) {
    apiCallTrack(function (trackApi) {
        var status = '2';

        if (! req.body.user_id) {
            trackApi(req);
            return res.status(400).json('Required Parameter Missing');
        }

        var user_ids = req.body.user_id;

        UserModel.update({
            trendata_user_status: status
        }, {
            where: {
                trendata_user_id: user_ids
            }
        }).spread(function (affectedCount, affectedRows) {
            trackApi(req);
            res.json({
                user_id: user_ids,
                user_status: status
            });
        }).catch(function (err) {
            trackApi(req);
            res.status(500).send(err.stack);
        });
    });
}

/**
 * update the user status
 * 0 :Suspend
 * 1: Activate
 * 2. Delete
 */
function updateUserStatus(user_id, status, callback)
{
    userModel.updateUserStatus(user_id, status, function (err, result) {

        if (err)
        {
            callback(err, null);
        }
        else {
            console.log("User status : " + status);
            var email_key = 'suspend_user';
            switch(status)
            {
                case '0':
                    email_key = 'suspend_user';
                    break;
                case '1':
                    email_key = 'activate_user';
                    break;
                case '2':
                    email_key = 'delete_user';

            }

            /*getEmailSubjectAndMessageText(email_key,function(err,emailResult){
                var message = emailResult.message;
                var subject = emailResult.subject;
                var tempData = {};
                result.forEach(function(val){
                    // console.log(val);
                    tempData = mappedUserDbValue(val);
                    var name = tempData['firstname']+" "+tempData['lastname'];
                    var email = tempData['email'];
                    sendProfileUpdateNotification(name,email,subject,message);
                });
            });*/




            callback(err,result);
        }
    });
}

/*
 * Send notification on profile update
 */
function sendProfileUpdateNotification(name,email,subject,message)
{
    var parameters = {
            name: name,
            message: message
        }

    var emailProfileUpdateTmplDir = path.join('./resources', 'templates', 'profile-update-email-tmpl');
    var welcomeEmail = new EmailTemplate(emailProfileUpdateTmplDir)

    welcomeEmail.render(parameters, function (err, result) {
        var message = result.html;
        global.sendMail(email,subject,message,function(err,result){
//                                    callback(err, tempData);
        });
     });

}

/*
 * return subject and message translation through callback
 */
function getEmailSubjectAndMessageText(email_key,callback)
{
    commonModel.getEmailTemplateValues(email_key,function(err,val){
                if (err)
                {
                    sendResponse(res, http_status.server_error, err);
                }
                else if(val != null) {


                    global.getTranslation(val.trendata_email_subject_token,function(err,values1){
                        if (err)
                            throw err;

                        //translating the description text
                        global.getTranslation(val.trendata_email_msg_token,function(err,values2){
                            if (err)
                                throw err;
                            var parameters = {
                                subject: values1,
                                message: values2
                            }
                            callback(err, parameters);
                        }); //eo getTranslation

                    }); // eo getTranslation
                }
                else{
                    callback(null, null);
                }
            });
}



var storage = multer.diskStorage({
    destination: function (req, file, callback) {

        callback(null, './uploads/');
    },
    filename: function (req, file, callback) {

        callback(null, file.fieldname + '-' + Date.now());
    }
});

var upload = multer({storage: storage}).single('userPhoto');
function uploadImage(req, res) {
    console.log("file: " + req.file + req.files);
    upload(req, res, function (err) {

        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
}

/* Save users grid settings
 *
 * @param {type} req
 * @param {type} res
 */
function saveUsersGridSettings(req, res) {
    apiCallTrack(function (trackApi) {
        if (req.body.forAllCharts) { // Save for all charts
            UsersGridSettingsModel.destroy({
                where: {
                    trendata_users_grid_settings_user_id: req.user.trendata_user_id
                }
            }).then(function() {
                UsersGridSettingsModel.create({
                    trendata_users_grid_settings_user_id: req.user.trendata_user_id,
                    trendata_users_grid_settings_chart_id: 0,
                    trendata_users_grid_settings_fields: req.body.fields.join(',')
                }).then(function(data) {
                    trackApi(req);
                    res.json(data);
                }).catch(function (err) {
                    trackApi(req, err);
                    res.status(500).json(err.stack);
                });
            })
        } else { // Save only for current chart
            UsersGridSettingsModel.update({
                trendata_users_grid_settings_fields: req.body.fields.join(',')
            }, {
                where: {
                    trendata_users_grid_settings_user_id: req.user.trendata_user_id,
                    trendata_users_grid_settings_chart_id: req.body.chartId
                }
            }).then(function (data) {
                if (data && data.length && data[0]) {
                    trackApi(req);
                    res.json(data);
                } else {
                    UsersGridSettingsModel.create({
                        trendata_users_grid_settings_user_id: req.user.trendata_user_id,
                        trendata_users_grid_settings_chart_id: req.body.chartId,
                        trendata_users_grid_settings_fields: req.body.fields.join(',')
                    }).then(function(data) {
                        trackApi(req);
                        res.json(data);
                    }).catch(function (err) {
                        trackApi(req, err);
                        res.status(500).json(err.stack);
                    });
                }
            }).catch(function (err) {
                trackApi(req, err);
                res.status(500).json(err.stack);
            });
        }
    });
}