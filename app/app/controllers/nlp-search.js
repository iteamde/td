var sequelize = require('sequelize');
var ChartModel = require('../models/orm-models').Chart;
var ChartTagModel = require('../models/orm-models').ChartTag;

function searchByTags(req, res) {
  ChartTagModel.findAll({
    attributes: ['trendata_chart_id', [sequelize.fn('count', sequelize.col('trendata_chart_tag_id')), 'tagsCount']],
    where: {
      trendata_tag_id: {
        $in: req.body.tags
      }
    },
    group: ['trendata_chart_id'],
    order: 'tagsCount DESC',
    limit: 3,
    include: [
      {
        model: ChartModel,
        require: true
      }
    ]
  }).then(function(result) {
    res.status(200).json(result);
  });
};

module.exports.searchByTags = searchByTags;