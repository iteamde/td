/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var multer = require('multer');
var decodeJwt = require('../models/user').decodeJwt;
var commonModel = require('../models/common');
var user_language_id = require('../config/constant');
var http_status = require('../config/constant').HTTP_STATUS;
var nodemailer = require('nodemailer');
var uuid = require('node-uuid');
var config = require('./../../config').config;
var jwt = require('jsonwebtoken');
require('../config/global');

var UserModel = require('../models/orm-models').User;
var LoginDetailModel = require('../models/orm-models').LoginDetail;

exports.sendResponse = sendResponse;

/**
 * @param res
 * @param status
 * @param content
 */
function sendResponse(res, status, content) {
    res.status(status);
    res.json(content);
}

/**
 * @param req
 * @param res
 * @param afterAuthorization
 */
exports.authorization = function (req, res, afterAuthorization) {
    var authorization = req.header('Authorization');

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
            return res.status(401).json('unauthorized');
        }

        jwt.verify(authorization, config.JWT_SECRET);
        req.user = user;
    }).then(function () {
        afterAuthorization();
    }).catch(function (err) {
        res.status(500).send(err.stack);
    });
};

/**
 * this function return the translated string
 */
global.getTranslation = function(token, cb) {
    commonModel.getTranslation(token,function(err,rows){   
        if (err)
            return callback(err);      
        else if(rows == null)
        {
             cb(err, null);
        }
        else if (rows.length) {
            var defaultLangTitle = "";
            var selectedLangTitle = "";
            rows.forEach(function (data) {
                if (data.trendata_language_id === global.default_language_id)
                {
                    defaultLangTitle = data.trendata_translation_text;
                }
                if (data.trendata_language_id === global.user_language_id)
                {
                    selectedLangTitle = data.trendata_translation_text;
                }
            });
            var languageTitle = (selectedLangTitle === "" ? defaultLangTitle : selectedLangTitle);            
            cb(err, languageTitle);
        }
        else
        {
           
        }
    });

};


/**
 * 
 * @returns {self.getGMTDateTime.dateTime|module.exports.getGMTDateTime.dateTime|String|module.exportswindow.getGMTDateTime.dateTime}This funciton return the string of date time 
 * Format Y-m-d H:i:s
 */
global.getGMTDateTime = function()
{
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    var dateTime =  year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
    
    return dateTime;
};

/*
 * function for sed the mail
 */
global.sendMail = function(email,subject,message,callback) {
//    console.log("Sendmail Called: ",config.MAIL_EMAIL,config.MAIL_PASSWORD);
    var transport = nodemailer.createTransport({
        host: 'localhost',
        port: 25,
        secure:true,
        ignoreTLS:false,
        debug:false
        });
    
    var mailOptions = {
        to: email,
        from: 'passwordreset@demo.com',
        subject: subject,
        html: message

    };

    transport.sendMail(mailOptions, function (err) {
        console.log(err);
        callback();
    });
};

global.getUUID = function()
{
    return  uuid.v1();
};


//
//var storage =   multer.diskStorage({
//  destination: function (req, file, callback) {
//    callback(null, './uploads');
//  },
//  filename: function (req, file, callback) {
//    callback(null, file.fieldname + '-' + Date.now());
//  }
//});
//var upload = multer({ storage : storage}).single('userPhoto');
