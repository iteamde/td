'use strict';

module.exports = require('express').Router();
const PromiseBreak = require('../../../components/promise-break');
const knex = require('../../../components/knex');
const generateJwt = require('../../../models/user').generateJwt;
const UserModel = require('../../../models/orm-models').User;
const LoginDetailModel = require('../../../models/orm-models').LoginDetail;
const jsTemplate = _.template(`
    <script type="application/javascript">
        window.localStorage.setItem('ngStorage-isAdmin', <%= is_admin %>);
        window.localStorage.setItem('ngStorage-trentoken', <%= auth_token %>);
        window.location.href = <%= redirect_url %>;
    </script>
`);

module.exports.get('/sso/:token', function (req, res) {
    let token = req.params.token;

    knex('trendata_sso')
        .where('trendata_sso_token', token)
        .limit(1)
        .then(function (rows) {
            if (!rows.length) {
                return Promise.reject(new PromiseBreak({
                    status: 404,
                    body: 'Token not found'
                }));
            }

            return rows[0];
        }).then(function (row) {
            return Promise.all([
                UserModel.findByPrimary(row.trendata_user_id).then(function (user) {
                    if (!user) {
                        return Promise.reject(new PromiseBreak({
                            status: 404,
                            body: 'User not found'
                        }));
                    }

                    return user;
                }),
                row
            ]);
        }).spread(function (user, sso) {
            let authToken = generateJwt(user);

            return LoginDetailModel.create({
                trendata_login_details_auth_token: authToken,
                trendata_login_details_ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress
            }).then(function (loginDetail) {
                return user.addLoginDetail(loginDetail);
            }).then(function () {
                knex('trendata_sso')
                    .where('trendata_sso_token', token)
                    .del()
                    .then(function () {})
                    .catch(console.error);

                res.cookie('auth_token', authToken, {
                    maxAge: 60 * 60 * 24 * 365 * 1000
                }).send(jsTemplate({
                    is_admin: JSON.stringify((1 == user.trendata_user_id).toString()),
                    auth_token: JSON.stringify(JSON.stringify(authToken)),
                    redirect_url: JSON.stringify(sso.trendata_sso_redirect_url)
                }));
            });
        }).catch(PromiseBreak, function (err) {
            res.status(err.data.status).json(err.data.body);
        }).catch(function (err) {
            res.status(500).send(err.stack);
        });
});
