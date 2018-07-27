#!/usr/bin/env node
'use strict';

const knex = require('../app/components/knex');
const uuid = require('uuid');

let email = process.argv[2];

if (!email) {
    console.error('Empty email');
    process.exit();
}

knex('trendata_user')
    .where('trendata_user_email', email)
    .limit(1)
    .then(function (rows) {
        if (!rows.length) {
            console.error(`User "${email}" not found`);
            process.exit();
        }

        return rows[0].trendata_user_id;
    }).then(function (userId) {
        let token = uuid();

        return knex('trendata_sso').insert({
            trendata_user_id: userId,
            trendata_sso_token: token,
            trendata_sso_redirect_url: '/#/dashboard/1',
            created_at: knex.raw('NOW()'),
            updated_at: knex.raw('NOW()')
        }).then(function () {
            console.log(token);
            process.exit();
        });
    }).catch(function (err) {
        console.error(err.message);
        process.exit();
    });
