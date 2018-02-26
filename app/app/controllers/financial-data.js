require('../config/global');
var apiCallTrack = require('../components/api-call-track');
var FinancialDataModel = require('../models/orm-models').FinancialData;

module.exports = {
    loadByYear: loadByYear,
    saveByYear: saveByYear
};

/**
 * @param req
 * @param res
 */
function loadByYear(req, res) {
    apiCallTrack(function (trackApi) {
        FinancialDataModel.findOne({
            where: {
                trendata_financial_data_year: req.params.year,
                trendata_financial_data_created_by: req && req.parentUser && req.parentUser.trendata_user_id || 0
            }
        }).then(function (data) {
            if (data) {
                trackApi(req);
                return res.json(JSON.parse(data.trendata_financial_data_json_data));
            }

            trackApi(req, new Error('Data not found'));
            res.status(404).json({
                status: 'error',
                message: 'Data not found'
            });
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
function saveByYear(req, res) {
    apiCallTrack(function (trackApi) {
        FinancialDataModel.findOrCreate({
            where: {
                trendata_financial_data_year: req.params.year,
                trendata_financial_data_created_by: req && req.parentUser && req.parentUser.trendata_user_id || 0
            },
            defaults: {
                trendata_financial_data_year: req.params.year,
                trendata_financial_data_created_by: req && req.parentUser && req.parentUser.trendata_user_id || 0,
                trendata_financial_data_json_data: JSON.stringify(req.body)
            }
        }).spread(function (row, created) {
            if (! created) {
                row.trendata_financial_data_json_data = JSON.stringify(req.body);
                return row.save();
            }
        }).then(function () {
            trackApi(req);
            res.json({
                status: 'success'
            });
        }).catch(function (err) {
            trackApi(req, err);
            res.status(500).send(err.stack);
        });
    });
}
