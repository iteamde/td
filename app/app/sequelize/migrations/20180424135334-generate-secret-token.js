'use strict';

var uuid = require('uuid/v4');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        var token = uuid();

        return queryInterface.sequelize.query(
            'INSERT INTO `trendata_setting` (`trendata_setting_name`) VALUES(\'api_auth_token\')'
        ).spread(function (meta) {
            return queryInterface.sequelize.query(
                'INSERT INTO `trendata_setting_value` (`trendata_setting_id`, `trendata_setting_value`) VALUES(?, ?)',
                {
                    replacements: [
                        meta.insertId,
                        token
                    ]
                }
            );
        });
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {

    }
};
