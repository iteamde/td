var nodemailer = require('nodemailer');

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
            let transporter = nodemailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                requireTLS: true,
                tls: {
                  ciphers: 'SSLv3'
                }
            });

            transporter.sendMail(options, (err, data) => {
                if (err)
                    return reject(err);

                resolve();
            });
        });
    }

    return Promise.reject(new Error('Not all fields are filled in'));
};
