
module.exports.config = {
    APP_VERSION : '1.1.0.0',
    PORT : '8000',

    DB_NAME:'trendata_orm',
    DB_HOST : 'localhost',
    DB_PORT : '3306',
    DB_USER: 'root',
    DB_PASSWORD:'root',

    PYTHON_SCRIPTS_DIR: '/home/ivan/Projects/git_trendata/src/app/app/python-scripts',
    // PYTHON_BIN: '',

    ATPL_TEMPLATE_PATH: __dirname + '/atpl-templates',

    JWT_SECRET:'trenDataMysteriousSecret',
    MAIL_EMAIL:'trendatatest2016@gmail.com',
    MAIL_PASSWORD:'trendata@123456789',
    MAIL_USERNAME : 'TrenData',

    sequelize: {
        database: 'trendata_orm',
        username: 'root',
        password: 'root',
        options: {
            host: 'localhost',
            port: 3306,
            dialect: 'mysql',
            logging: false,
            benchmark: true,
            maxConcurrentQueries: 0,
            define: {
                charset: 'utf8',
                collate: 'utf8_unicode_ci',
                timestamps: true,
                underscored: true
            },
            pool: {
                maxConnections: 100,
                minConnections: 30,
                maxIdleTime: 600000
            }
        }
    },

    nodemailer: {
        transport: {
            service: 'gmail',
            auth: {
                user: 'sender@gmail.com',
                pass: 'password'
            }
        },
        from: '<user@gmail.com>',
        viewsPath: 'path/to/views'
    },

    connector_csv_files_dir: __dirname + '/connector-csv-files',
    connector_csv_files_archive_dir: __dirname + '/connector-csv-files-archive',

    SERVER_NAME : 'localhost'
};
