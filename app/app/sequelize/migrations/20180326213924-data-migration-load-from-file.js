'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var os = require('os');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var knex = require('../../components/knex');
var pathToFile = path.join(os.tmpdir(), 'trendata-data-migration-' + __dirname.replace(/\//g, '-') + '.json');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: async (queryInterface, Sequelize) => {
        if (!global._dataMigration) {
            return;
        }

        let fileData = global._dataMigration;

        await Promise.each(fileData.customFields, function (item) {
            return queryInterface.sequelize.query(
                knex('trendata_bigdata_custom_field').insert({
                    trendata_bigdata_custom_field_name: item,
                    created_at: knex.raw('NOW()'),
                    updated_at: knex.raw('NOW()')
                }).toString()
            );
        });

        await queryInterface.sequelize.query('DELETE FROM `trendata_bigdata_user`');

        await Promise.each(fileData.customFields, function (item) {
            return queryInterface.sequelize.query(
                knex.raw('ALTER TABLE `trendata_bigdata_user` ADD ?? varchar(255) COLLATE \'utf8_unicode_ci\' NULL', [
                    item
                ]).toString()
            );
        });

        await Promise.each(fileData.customFields, function (item, index) {
            if (index >= 15) {
                return;
            }

            return queryInterface.sequelize.query(
                knex.raw('ALTER TABLE `trendata_bigdata_user` ADD INDEX ?? (??)', [
                    item,
                    item
                ]).toString()
            );
        });

        await Promise.resolve(fileData.data).then(function (data) {
            return _.chunk(data, 1000);
        }).each(function (rows) {
            return queryInterface.sequelize.query(
                knex('trendata_bigdata_user').insert(rows).toString()
            );
        });

        delete global._dataMigration;

        //await fs.unlinkAsync(pathToFile);
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: (queryInterface, Sequelize) => {

    }
};

