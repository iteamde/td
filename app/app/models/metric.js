/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var db = require('../config/db');

/**
 * @type {{getMetricList: getMetricList, getMetircChartList: getMetircChartList, getMetircSimilarChartList: getMetircSimilarChartList, getChartDetails: getChartDetails}}
 */
module.exports = {
    getMetricList: getMetricList,    
    getMetircChartList: getMetircChartList,
    getMetircSimilarChartList: getMetircSimilarChartList,
    getChartDetails: getChartDetails
};

/**
 * This function returns the list of metirc
 * @param {type} callback
 * @returns {undefined}
 */
function getMetricList(callback) {
    var query = "SELECT * FROM `trendata_metric` WHERE trendata_metric_status='1'";
 
    db.get().query(query, function (err, rows) {
        console.log(err);
        if (err) return callback(err);
        callback(null, rows)
    });
}

/**
 * This function returns the rows of charts for metircs
 */
function getMetircChartList(metricID,callback) {
    var query = "SELECT * FROM `trendata_metric_chart` as tmt \
        LEFT JOIN `trendata_chart` as tt ON tt.trendata_chart_id=tmt.trendata_chart_id \
        LEFT JOIN trendata_chart_display_type as tct ON tct.trendata_chart_display_type_id=tt.trendata_chart_default_chart_display_type \
        WHERE trendata_chart_status='1' AND tmt.trendata_metric_id=" + metricID;

    db.get().query(query, function (err, rows) {
        console.log(err);
        if (err) {
            return callback(err);
        }
        callback(null, rows)
    });
}

/**
 * This function returns the rows of charts for metircs
 */
function getMetircSimilarChartList(chartID,callback) {
    var query = "SELECT * FROM `trendata_metric_chart` as tmt \
        LEFT JOIN `trendata_chart` as tt ON tt.trendata_chart_id=tmt.trendata_chart_id \
        LEFT JOIN trendata_chart_display_type as tct ON tct.trendata_chart_display_type_id=tt.trendata_chart_default_chart_display_type \
        WHERE trendata_chart_status='1' AND tmt.trendata_chart_id IN (\
        SELECT trendata_chart_id FROM trendata_chart_tag WHERE trendata_tag_id IN (\
            SELECT trendata_tag_id FROM trendata_chart_tag WHERE trendata_chart_id='" + chartID + "')\
        ) GROUP BY tt.trendata_chart_id";

    db.get().query(query, function (err, rows) {
        console.log(err);
        if (err) return callback(err);
        callback(null, rows)
    });
}

/**
 * This function returns the rows of charts for metircs
 */
function getChartDetails(chartID,callback) {
    var query = "SELECT * FROM `trendata_metric_chart` as tmt \
        LEFT JOIN `trendata_chart` as tt ON tt.trendata_chart_id=tmt.trendata_chart_id \
        LEFT JOIN trendata_chart_display_type as tct ON tct.trendata_chart_display_type_id=tt.trendata_chart_default_chart_display_type \
        WHERE trendata_chart_status='1' AND tmt.trendata_chart_id = '" + chartID + "'";

    db.get().query(query, function (err, rows) {
        console.log(err);
        if (err) return callback(err);
        callback(null, rows)
    });
}
