'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('trendata_performance', {
        trendata_performance_id: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        trendata_performance_title: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        trendata_performance_value: {
            type: Sequelize.FLOAT(2, 1),
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
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('trendata_performance')
  }
};
