'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(
            'INSERT INTO `trendata_setting` (`trendata_setting_name`, `created_at`, `updated_at`) VALUES (?, now(), now())',
            {
                replacements: [
                    'kueri_datasource_id'
                ]
            }
        ).spread(function (meta) {
            return queryInterface.sequelize.query(
                'INSERT INTO `trendata_setting_value` (`trendata_setting_id`, `trendata_setting_value`, `created_at`, `updated_at`) VALUES (?, ?, now(), now())',
                {
                    replacements: [
                        meta.insertId,
                        11
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
