'use strict';

var ChartModel = require('../../models/orm-models').Chart;

module.exports = {
  up: function (queryInterface, Sequelize) {
    return ChartModel.findAll({
        where: {
            trendata_chart_id_parent: null
        },
        include: [
            {
                model: ChartModel,
                as: 'ChildCharts',
                required: false
            }
        ]
    }).each(function(chart) {
        ChartModel.update({
            trendata_chart_title_token: chart.trendata_chart_title_token
        }, {
            where: {
                trendata_chart_id: _.map(chart.ChildCharts, 'trendata_chart_id')
            }
        });
    })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
