/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var db = require('../config/db');

/**
 * @type {{getEventList: getEventList, getEventCategory: getEventCategory, createEvent: createEvent, createEventCategory: createEventCategory}}
 */
module.exports = {
    getEventList: getEventList,
    getEventCategory:getEventCategory,
    createEvent:createEvent,
    createEventCategory:createEventCategory
};

/**
 * This function returns the list of metirc
 * @param {type} callback
 * @returns {undefined}
 */
function getEventList(callback) {
    var query = "SELECT te.*,tec.trendata_event_category_id as category_id, tec.trendata_event_category_title_token  FROM trendata_event_category as tec\
            LEFT JOIN  `trendata_event` as te ON te.trendata_event_category_id = tec.trendata_event_category_id";

    db.get().query(query, function (err, rows) {
        console.log(err);
        if (err) return callback(err);
        callback(null, rows)
    });
}

/**
 * Create Event
 */
function createEvent(eventDetails,callback){
    var query = db.get().query('INSERT INTO trendata_event SET ?', [eventDetails], function(err, result) {
    if (err) return callback(err);              
    callback(null, result.insertId)
  });   
}

/**
 * Create Event Category
 */
function createEventCategory(eventCategoryDetails,callback){
    var query = db.get().query('INSERT INTO trendata_event_category SET ?', [eventCategoryDetails], function(err, result) {
    if (err) return callback(err);              
    callback(null, result.insertId)
  });   
}


/**
 * Return event details
 */
function getEventDetails(id,callback) {
    var query = "SELECT * FROM `trendata_event`  WHERE trendata_event_id='"+id+"'";
    
    console.log(query);
    db.get().query(query, function (err, rows) {        
        if (err) return callback(err);        
        console.log("getEventDetails called");
        callback(null, rows[0])
    });
}

/**
 * @param callback
 */
function getEventCategory(callback) {
    var query = "SELECT *  FROM trendata_event_category";
 
    db.get().query(query, function (err, rows) {
        console.log(err);
        if (err) return callback(err);
        callback(null, rows)
    });
}
