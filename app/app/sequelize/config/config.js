var config = require('../../../config').config;

module.exports = {
    /*"demo": {
        "username": "tduser",
        "password": "abs.9FrefHer",
        "database": "trendata",
        "host": "davinci",
        "port": 3306,
        "dialect": "mysql"
    },
    "stage": {
        "username": "stage",
        "password": "stage",
        "database": "stage",
        "host": "davinci",
        "port": 3306,
        "dialect": "mysql"
    },*/
    development: {
        username: config.sequelize.username,
        password: config.sequelize.password,
        database: config.sequelize.database,
        host: config.sequelize.options.host,
        port: config.sequelize.options.port,
        dialect: config.sequelize.options.dialect
    }
};
