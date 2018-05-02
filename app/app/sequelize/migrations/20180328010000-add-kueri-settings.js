'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            /**
             *
             */
            queryInterface.sequelize.query(
                'INSERT INTO `trendata_setting` (`trendata_setting_name`) VALUES(?)',
                {
                    replacements: [
                        'kueri_username'
                    ]
                }
            ).spread(function (metadata) {
                return queryInterface.sequelize.query(
                    'INSERT INTO `trendata_setting_value` (`trendata_setting_id`, `trendata_setting_value`) VALUES(?, ?)',
                    {
                        replacements: [
                            metadata.insertId,
                            'cubicrubickid@gmail.com'
                        ]
                    }
                )
            }),

            /**
             *
             */
            queryInterface.sequelize.query(
                'INSERT INTO `trendata_setting` (`trendata_setting_name`) VALUES(?)',
                {
                    replacements: [
                        'kueri_password'
                    ]
                }
            ).spread(function (metadata) {
                return queryInterface.sequelize.query(
                    'INSERT INTO `trendata_setting_value` (`trendata_setting_id`, `trendata_setting_value`) VALUES(?, ?)',
                    {
                        replacements: [
                            metadata.insertId,
                            'ivan123'
                        ]
                    }
                )
            })
        ]);
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DELETE FROM `trendata_setting` WHERE trendata_setting_name IN (\'kueri_username\', \'kueri_password\')');
    }
};
