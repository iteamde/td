'use strict';

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    pool: true,
    host: 'darwin.trendata.com',
    port: 25,
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

/**
 * @param options = {
 *      to: '',
 *      subject: '',
 *      html: '',
 *      text: ''
 *  }
 * @return {Promise}
 */
module.exports = function (options) {
    options = _.merge({
        from: 'TrenData <donotreply@trendata.com>'
    }, options || {});

    if (options.to && options.subject && (options.html || options.text)) {
        return new Promise(function (resolve, reject) {
            transporter.sendMail(options, function (err, info) {
                err ? reject(err) : resolve(info);
            });
        });
    }

    return Promise.reject(new Error('Not all fields are filled in'));
};
