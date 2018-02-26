/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var db = require('../config/db');


module.exports = {
    getDashboardList: getDashboardList,    
    getDashboardChartList: getDashboardChartList,
};

/*
 * Returns rows of Dashboard
 * @param {type} callback
 * @returns rows
 */
function getDashboardList(callback) {
    var query = "SELECT *  FROM `trendata_dashboard` WHERE trendata_dashboard_status='1'";
    
    db.get().query(query, function (err, rows) {
        console.log(err);
        if (err) return callback(err);
        callback(null, rows)
    });
}

/*
 * Return rows of Charts for Given Dasbhoard
 */
function getDashboardChartList(dashboardID, callback) {
    var query = "SELECT * FROM `trendata_dashboard_chart` as tdt " +
        "LEFT JOIN `trendata_chart` as tt ON tt.trendata_chart_id=tdt.trendata_chart_id " +
        "LEFT JOIN trendata_chart_display_type as tct ON tct.trendata_chart_display_type_id=tt.trendata_chart_default_chart_display_type " +
        "WHERE trendata_chart_status='1' AND tdt.trendata_dashboard_id=" + dashboardID;
    
    db.get().query(query, function (err, rows) {
        console.log(err);
        if (err) return callback(err);
        callback(null, rows)
    });
}