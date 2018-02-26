'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      // DrillDown
      queryInterface.sequelize.query('SELECT `trendata_chart_id_parent` as `id` FROM `trendata_chart` as `tc` INNER JOIN `trendata_chart_type` as `tct` ON `tc`.`trendata_chart_type_id` = `tct`.`trendata_chart_type_id` WHERE `tct`.`trendata_chart_type_name` = \'drilldown\'', {
        type: Sequelize.QueryTypes.SELECT
      }).then(function(charts) {
        if (! charts.length)
          return;

        charts.forEach(function(chart) {
          var url = '/drill-down/' + chart.id;
          queryInterface.sequelize.query('INSERT INTO `trendata_video` (`trendata_video_url`, `trendata_video_video`) VALUES (\'' + url + '\', \'https://youtu.be/5SRn7U0NKkM\')');
        });
      }),
      // Analyrics
      queryInterface.sequelize.query('SELECT `trendata_chart_id_parent` as `id` FROM `trendata_chart` as `tc` INNER JOIN `trendata_chart_type` as `tct` ON `tc`.`trendata_chart_type_id` = `tct`.`trendata_chart_type_id` WHERE `tct`.`trendata_chart_type_name` = \'analytics\'', {
        type: Sequelize.QueryTypes.SELECT
      }).then(function(charts) {
        if (! charts.length)
          return;

        charts.forEach(function(chart) {
          var url = '/analytics/' + chart.id;
          queryInterface.sequelize.query('INSERT INTO `trendata_video` (`trendata_video_url`, `trendata_video_video`) VALUES (\'' + url + '\', \'https://youtu.be/NDR4BfLi8Bk\')');
        });
      }),
      // Dashboard
      queryInterface.sequelize.query('SELECT `trendata_dashboard_id` as `id` FROM `trendata_dashboard`', {
        type: Sequelize.QueryTypes.SELECT
      }).then(function(charts) {
        if (! charts.length)
          return;

        charts.forEach(function(chart) {
          var url = '/dashboard/' + chart.id;
          queryInterface.sequelize.query('INSERT INTO `trendata_video` (`trendata_video_url`, `trendata_video_video`) VALUES (\'' + url + '\', \'https://youtu.be/T_hi0nNHrzo\')');
        });
      }),
      queryInterface.sequelize.query('INSERT INTO `trendata_video` (`trendata_video_url`, `trendata_video_video`) VALUES (\'/dashboard/\', \'https://youtu.be/T_hi0nNHrzo\')'),
      // TUFF
      queryInterface.sequelize.query('INSERT INTO `trendata_video` (`trendata_video_url`, `trendata_video_video`) VALUES (\'/connector/4\', \'https://youtu.be/6PEtLUGI6LY\')')
    ]);
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query('TRUNCATE `trendata_video`');
  }
};
