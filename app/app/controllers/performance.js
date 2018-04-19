var PerformanceModel = require('../models/orm-models').Performance;
var apiCallTrack = require('../components/api-call-track');

module.exports = {
    getPerformances: function(req, res) {
         apiCallTrack(function (trackApi) {
            PerformanceModel.findAll({
                order: [['trendata_performance_value', 'ASC']]
            }).map(function(item) {
                return {
                    id: item.trendata_performance_id,
                    title: item.trendata_performance_title,
                    value: item.trendata_performance_value
                };
            }).then(function (rows) {
                trackApi(req);
                res.json(rows);
            }).catch(function (err) {
                trackApi(req, err);
                res.status(500).send(err.stack);
            });
        });
    },

    createPerformance: function(req, res) {
        apiCallTrack(function (trackApi) {
            let performanceFunc = req.body.id ?
                PerformanceModel.update({
                    trendata_performance_value: req.body.value,
                    trendata_performance_title: req.body.title
                }, {
                    where: {
                        trendata_performance_id: req.body.id
                    }
                }) :
                PerformanceModel.create({
                    trendata_performance_value: req.body.value,
                    trendata_performance_title: req.body.title
                });

            performanceFunc.then(function (row) {
                trackApi(req);
                res.json({
                    id: row.trendata_performance_id,
                    title: row.trendata_performance_title,
                    value: row.trendata_performance_value
                });
            }).catch(function (err) {
                trackApi(req, err);
                res.status(500).send(err.stack);
            });
        });
    },

    deletePerformance: function(req, res) {
        apiCallTrack(function (trackApi) {
            PerformanceModel.destroy({
                where: {
                    trendata_performance_id: req.body.id
                }
            }).then(function () {
                trackApi(req);
                res.json(req.body.id);
            }).catch(function (err) {
                trackApi(req, err);
                res.status(500).send(err.stack);
            });
        });
    }
}