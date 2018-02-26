var vm = require('vm');

/**
 * @param customSrc
 * @param data
 * @param options
 * @return {Promise}
 */
module.exports = function (customSrc, data, options) {
    return new Promise(function (resolve, reject) {
        options = _.merge({
            timeout: 60000,
            displayErrors: true,
            contextProps: {
                _resolve: resolve,
                _reject: reject,
                _data: data,
                Promise: Promise
            }
        }, options);
        var script = new vm.Script(customSrc);
        var context = new vm.createContext(options.contextProps);
        script.runInContext(context, {
            timeout: options.timeout,
            displayErrors: options.displayErrors
        });
    }).timeout(options.timeout, 'Operation timed out: ' + options.timeout);
};
