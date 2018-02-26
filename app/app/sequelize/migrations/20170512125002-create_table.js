'use strict';

var Promise = require('bluebird');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            /**
             * Create table
             */
            queryInterface.createTable('trendata_user_activity', {
                trendata_user_activity_id: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                trendata_user_id: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: true
                },
                trendata_user_api_execution_time: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: true
                },
                trendata_user_api_error_message: {
                    type: Sequelize.TEXT,
                    allowNull: true
                },
                trendata_user_activity_ip_address: {
                    type: Sequelize.STRING(255),
                    allowNull: true
                },
                trendata_user_activity_url: {
                    type: Sequelize.STRING(255),
                    allowNull: true
                },
                trendata_user_activity_referrer_page: {
                    type: Sequelize.STRING(255),
                    allowNull: true
                },
                trendata_user_activity_browser: {
                    type: Sequelize.STRING(255),
                    allowNull: true
                },
                trendata_user_activity_session_id: {
                    type: Sequelize.STRING(511),
                    allowNull: true
                },
                trendata_user_activity_type: {
                    type: Sequelize.ENUM,
                    values: [
                        'page-call',
                        'api-call'
                    ],
                    defaultValue: 'page-call',
                    allowNull: false
                },
                created_at: {
                    type: Sequelize.DATE
                },
                updated_at: {
                    type: Sequelize.DATE
                }
            }, {
                charset: 'utf8',
                collate: 'utf8_unicode_ci'
            })
        ]);
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('trendata_user_activity');
    }
};
