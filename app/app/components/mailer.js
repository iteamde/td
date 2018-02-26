var mail = require('nodemailer').mail;

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
        from: 'TrenData <donotreply@trendata.com>',
        ssl: true
    }, options || {});

    if (options.to && options.subject && (options.html || options.text)) {
        return new Promise(function (resolve, reject) {
            mail(options);
            resolve();
        });
    }

    return Promise.reject(new Error('Not all fields are filled in'));
};
