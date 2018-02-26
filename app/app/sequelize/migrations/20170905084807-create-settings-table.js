'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.createTable('trendata_setting', {
          trendata_setting_id: {
              type: Sequelize.INTEGER.UNSIGNED,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true
          },
          trendata_setting_name: {
              type: Sequelize.STRING(255),
              allowNull: false
          },
          created_at: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.fn('NOW')
          },
          updated_at: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.fn('NOW')
          }
      }, {
          charset: 'utf8',
          collate: 'utf8_unicode_ci'
      }).then(function () {
          return queryInterface.createTable('trendata_setting_value', {
              trendata_setting_value_id: {
                  type: Sequelize.INTEGER.UNSIGNED,
                  allowNull: false,
                  primaryKey: true,
                  autoIncrement: true
              },
              trendata_setting_id: {
                  type: Sequelize.INTEGER.UNSIGNED,
                  allowNull: false,
                  references: {
                      model: 'trendata_setting',
                      key: 'trendata_setting_id'
                  },
                  onUpdate: 'cascade',
                  onDelete: 'cascade'
              },
              trendata_setting_value: {
                  type: Sequelize.STRING(255),
                  allowNull: false
              },
              created_at: {
                  type: Sequelize.DATE,
                  defaultValue: Sequelize.fn('NOW')
              },
              updated_at: {
                  type: Sequelize.DATE,
                  defaultValue: Sequelize.fn('NOW')
              }
          }, {
              charset: 'utf8',
              collate: 'utf8_unicode_ci'
          });
      }).then(function(rows) {
          return Promise.all([
              queryInterface.sequelize.query(
                  'INSERT INTO `trendata_setting` (`trendata_setting_name`) VALUES (\'site_type\')'
              ),
              queryInterface.sequelize.query(
                  'INSERT INTO `trendata_setting` (`trendata_setting_name`) VALUES (\'max_ondemand_number_of_users\')'
              )]).then(function(settings) {
              return Promise.all([
                  queryInterface.sequelize.query(
                      'INSERT INTO `trendata_setting_value` (`trendata_setting_id`, `trendata_setting_value`) VALUES (' + settings[0][0].insertId + ', \'enterprise\')'
                  ),
                  queryInterface.sequelize.query(
                      'INSERT INTO `trendata_setting_value` (`trendata_setting_id`, `trendata_setting_value`) VALUES (' + settings[1][0].insertId + ', 5)'
                  )
              ]);
          });
      });
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.dropTable('trendata_setting'),
      queryInterface.dropTable('trendata_setting_value')
    ]);
  }
};
