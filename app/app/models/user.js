var db = require('../config/db');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('./../../config').config;

module.exports = {
    getUser: getUser,
    setPassword: setPassword,
    validPassword: validPassword,
    generateJwt: generateJwt,
    decodeJwt: decodeJwt,
    saveLoginDetails:saveLoginDetails,
    getUserList:getUserList,
    isEmailExists:isEmailExists,
    addNewUser:addNewUser,
    updateUserStatus:updateUserStatus,
    updateUser:updateUser
};

/**
 * Authenticate user with user email
 * And return the user details
 */
function getUser(email, password, callback) {
    var query = "SELECT * FROM `trendata_user` WHERE `trendata_user_email` = '" + email + "'";

    db.get().query(query, function (err, rows) {
        console.log(err);
        if (err) return callback(err);
        callback(null, rows)
    });
}

/**
 * Returns the user list
 * Does not matter it is active user or inactive user
 */
function getUserList(offset, limit, sort, callback) {
    var orderBy = '';
    var columns = {
        firstname: 'trendata_user_firstname',
        email: 'trendata_user_email',
        designation: 'trendata_user_designation',
        status: 'trendata_user_status'
    };

    if ('' != sort) {
        if (sort.indexOf('-') === 0) {
            orderBy = 'ORDER BY `trendata_user`.`' + columns[sort.substring(1)] + '` DESC'
        } else {
            orderBy = 'ORDER BY `trendata_user`.`' + columns[sort] + '` ASC'
        }
    }

    var query = "SELECT * FROM `trendata_user`" +
        " LEFT JOIN trendata_language ON trendata_user_language_id = trendata_language_id " +
        "WHERE trendata_user_status != '2' " + orderBy + " " +
        "LIMIT " + parseInt(limit) + " OFFSET " + parseInt(offset);
    
    db.get().query(query, function (err, rows) {
        console.log(err);
        if (err) return callback(err);
        
        callback(null, rows)
    });
}

/**
 * @param userID
 * @param ipAddress
 * @param accessToken
 */
function saveLoginDetails(userID, ipAddress, accessToken){
    var query;

    var loginDetails  = {
        trendata_login_details_user_id: userID, 
        trendata_login_details_auth_token:accessToken,
        trendata_login_details_ip_address:ipAddress
    };
    var query = db.get().query('INSERT INTO trendata_login_details SET ?', [loginDetails], function(err, result) {
    // Neat!
  });
   
}

/**
 * validate email exists or not in database 
 */
function isEmailExists(email,user_id,callback) {
    var query = "SELECT * FROM `trendata_user` WHERE trendata_user_email = '" + email + "'";
    if(user_id != null)
    {
        query = query+ " AND trendata_user_id !='"+user_id+"'";
    }
            
    db.get().query(query, function (err, rows) {       
        if (err) return callback(err);
        
        callback(null, rows)
    });
}

/**
 * add new user in user table
 */
function addNewUser(userDetails, callback){
    var query;
//    console.log("saveLoinDetails");
   
//    console.log(loginDetails);
    query = db.get().query('INSERT INTO trendata_user SET ?', [userDetails], function(err, result) {
    if (err) return callback(err);
        
        getUserDetails(result.insertId,callback)
//        callback(null, result)
  });
   
}


/**
 * add new user in user table
 */
function updateUser(userDetails,user_id,callback){
    var query;
    query = db.get().query('UPDATE `trendata_user` SET ? WHERE trendata_user_id = ?', [userDetails,user_id], function(err, result) {
        if (err) return callback(err);
        else
        {
            getUserDetails(user_id,callback)
        }
  });
   
}

/**
 *
 * @param id
 * @param callback
 */
function getUserDetails(id,callback) {
    var query;
    query = "SELECT * FROM `trendata_user` LEFT JOIN trendata_language ON trendata_user_language_id = trendata_language_id WHERE trendata_user_id='"+id+"'";    
    db.get().query(query, function (err, rows) {        
        if (err) return callback(err);    
        
        callback(null, rows[0])
    });
}

/**
 *
 * @param ids
 * @param callback
 */
function getBulkUserDetails(ids,callback) {
    var query;
    query = "SELECT * FROM `trendata_user` LEFT JOIN trendata_language ON trendata_user_language_id = trendata_language_id WHERE trendata_user_id IN ("+ids+")";
    db.get().query(query, function (err, rows) {
        if (err) return callback(err);

        callback(null, rows)
    });
}

/**
 *
 * @param ids
 * @param status
 * @param callback
 */
function updateUserStatus(ids,status,callback) {
    var query;
    query = "UPDATE `trendata_user` SET `trendata_user_status`='"+status+"' WHERE trendata_user_id IN ("+ids+")";
    
    db.get().query(query, function (err, rows) {        
        if (err) return callback(err);
        getBulkUserDetails(ids,callback);
    });
}

// set password when signing up or manually
/**
 * @param password
 */
function setPassword(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
}

// validate password
/**
 * @param password
 * @param user
 * @returns {boolean}
 */
function validPassword(password, user) {
    var salt, hash, generatedHash;

    salt = user.trendata_user_salt;
    hash = user.trendata_user_password;

    generatedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha1').toString('hex');
    return hash === generatedHash;
}

// generate json web token
/**
 * @param user
 * @returns {*}
 */
function generateJwt(user) {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: user.trendata_user_id,
        email: user.trendata_user_email,
        firstname: user.trendata_user_firstname,
        lastname: user.trendata_user_lastname,
        language: user.trendata_user_language_id,
        exp: parseInt(expiry.getTime() / 1000),
    }, config.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
}

//Decode the token into json value
/**
 * @param token
 * @returns {*}
 */
function decodeJwt(token){
    var decoded = jwt.decode(token, {complete: true});
    return decoded.payload;
}

