'use strict';

var Promise = require('bluebird');

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.each([
            "UPDATE `trendata_translation` SET `trendata_translation_text` = 'Welcome to TrenData!' WHERE `trendata_translation`.`trendata_translation_id` = 246;",
            "UPDATE `trendata_translation` SET `trendata_translation_text` = 'Dear <firstname> <lastname>,\n\nYou have been added as a user to TrenData system. Please open <siteurl> and login with the below credentials. It is recommended that you change your password in the system once you log in.\n\nUsername: <username>\nPassword: <password>\n\nRegards,\nTrenData Administration' WHERE `trendata_translation`.`trendata_translation_id` = 247;"
        ], function (item) {
            return queryInterface.sequelize.query(item);
        });
    },

    down: function (queryInterface, Sequelize) {
        return Promise.resolve();
    }
};
