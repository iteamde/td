/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var db = require('../config/db');

module.exports = {
    getTranslation: getTranslation,
    getUserLoginDetails: getUserLoginDetails,
    addTranslations:addTranslations,
    getEmailTemplateValues:getEmailTemplateValues
};

/**
 * Get translation according to token
 * @param token
 * @param cb
 */
function getTranslation(token, cb) {
    var query = "SELECT * FROM `trendata_translation` WHERE  trendata_translation_token='" + token + "'";
    db.get().query(query, function (err, rows) {
        if (err) {
            return callback(err);
        } else if (rows.length) {
            cb(err, rows);
        } else {
            cb(err, null);
        }
    });
}

/**
 * @param key
 * @param cb
 */
function getEmailTemplateValues(key, cb) {
    var query = "SELECT * FROM `trendata_email_template` WHERE  trendata_email_template_key='" + key + "'";
    console.log(query);
    db.get().query(query, function (err, rows) {
        if (err){          
            return callback(err);  
        } else if (rows.length) {
            cb(err, rows[0]);
        } else {
            cb(err, null);
        }
    });
}

/**
 * --- Not used ---
 * @param token
 * @param callback
 * @returns {*}
 */
function getUserLoginDetails(token, callback) {
    var query;
    var queryData;

    query = "SELECT u.trendata_user_id,u.trendata_user_language_id FROM `trendata_login_details` ld LEFT JOIN trendata_user u ON u.trendata_user_id = ld.trendata_login_details_user_id  WHERE trendata_login_details_auth_token='" + token + "'";

    return db.get().query(query, function (err, rows) {
        if (err) {
            return callback(err);
        }

        callback(null, rows);
    });
}

/**
 * @param translationValue
 * @param callback
 */
function addTranslations(translationValue, callback) {
    var queryString = 'INSERT INTO trendata_translation (trendata_language_id, trendata_translation_text, trendata_translation_token) VALUES ?';
    var query = db.get().query(queryString, [translationValue], function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result)
    });
}
