var cacheSrc = {};
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

/**
 * @param module
 * @return {Promise}
 */
module.exports = function (module) {
    var pathToModule = path.normalize(__dirname + '/../chart-modules/' + module + '.js');

    if (cacheSrc[pathToModule]) {
        return Promise.resolve(cacheSrc[pathToModule]);
    }

    return fs.readFileAsync(pathToModule).then(function (src) {
        return cacheSrc[pathToModule] = src;
    });
};
