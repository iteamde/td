'use strict';

var PythonShell = require('python-shell');
var config = require('../../config').config;

module.exports = function (pythonFile, data) {
    data = undefined === data ? {} : data;
    return new Promise(function (resolve, reject) {
        PythonShell.run(pythonFile, {
            mode: 'text',
            pythonPath: config.PYTHON_BIN,
            scriptPath: config.PYTHON_SCRIPTS_DIR,
            args: [Buffer.from(JSON.stringify(data)).toString('base64')]
        }, function (err, data) {
            console.log('=============== Python End ===============');
            err ? reject(err) : resolve(data);
        });
    });
};
