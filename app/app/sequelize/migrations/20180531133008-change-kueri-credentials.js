'use strict';

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(`
            UPDATE trendata_setting_value v 
            JOIN trendata_setting s ON v.trendata_setting_id = s.trendata_setting_id
            SET v.trendata_setting_value = 'sysadmin@techgenies.com'
            WHERE s.trendata_setting_name = 'kueri_username'
        `).then(function () {
            return queryInterface.sequelize.query(`
                UPDATE trendata_setting_value v 
                JOIN trendata_setting s ON v.trendata_setting_id = s.trendata_setting_id
                SET v.trendata_setting_value = 'mL1GYB9iqRJ6'
                WHERE s.trendata_setting_name = 'kueri_password'
            `);
        });
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {

    }
};
