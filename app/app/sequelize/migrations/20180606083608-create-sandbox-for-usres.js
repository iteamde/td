'use strict';
var UserModel = require('../../models/orm-models').User;
var DashboardModel = require('../../models/orm-models').Dashboard;
var DashboardChartModel = require('../../models/orm-models').DashboardChart;

module.exports = {
  up: function (queryInterface, Sequelize) {
    return UserModel.findAll({
        where: {
          trendata_user_id: {
                $ne: 1
            }
        }
    }).then(function(users) {
        users.forEach(function(user) {
            DashboardModel.findOne({
                where: {
                    trendata_user_id: user.trendata_user_id
                }
            }).then(function(dashboard) {
                if (dashboard)
                    return true;

                return DashboardModel.create({
                    trendata_user_id: user.trendata_user_id,
                    trendata_dashboard_created_by: user.trendata_user_id,
                    trendata_dashboard_last_modified_by: user.trendata_user_id,
                    trendata_dashboard_title_token: 'c0eadd82-4bff-4e2f-bbf2-c6ad630f6406',
                    trendata_dashboard_description_token: '',
                    trendata_dashboard_icon: 'fa fa-tachometer'
                }).then(function (dashboard) {
                    let singleValueCharts = [58, 59, 61, 71, 73, 105];
                    let defaultCharts = [7, 30, 29, 17, 60, 55, 74, 75, 96, 99, 102];
                    singleValueCharts.forEach(function (chartId, index) {
                        DashboardChartModel.create({
                            trendata_dashboard_chart_created_by: user.trendata_user_id,
                            trendata_dashboard_chart_last_modified_by: user.trendata_user_id,
                            trendata_dashboard_chart_order: index,
                            trendata_dashboard_id: dashboard.trendata_dashboard_id,
                            trendata_chart_id: chartId,
                            trendata_dashboard_chart_width: 2,
                            trendata_dashboard_chart_height: 2,
                        }).catch(function (err) {
                            console.log('CHART ', chartId, err.message || err);
                        });
                    });

                    defaultCharts.forEach(function (chartId, index) {
                        DashboardChartModel.create({
                            trendata_dashboard_chart_created_by: user.trendata_user_id,
                            trendata_dashboard_chart_last_modified_by: user.trendata_user_id,
                            trendata_dashboard_chart_order: index,
                            trendata_dashboard_id: dashboard.trendata_dashboard_id,
                            trendata_chart_id: chartId,
                            trendata_dashboard_chart_width: 3,
                            trendata_dashboard_chart_height: 4,
                            x: (index % 4) * 3,
                            y: Math.ceil(index / 4) * 4
                        }).catch(function (err) {
                            console.log('CHART ', chartId, err.message || err);
                        });
                    });
                });
            });
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
