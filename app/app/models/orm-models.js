var ORM = require('sequelize');
var orm = require('../components/orm/orm');
var crypto = require('crypto');
var useragent = require('useragent');
var models = {};
var translationsCache = {};

setInterval(function() {
    translationsCache = {};
}, 60000);

/* ==================================================== Models ====================================================== */

/**
 * ChartDisplayType
 * @type {Model}
 */
models.ChartDisplayType = orm.define('ChartDisplayType', {
    trendata_chart_display_type_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_chart_display_type_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_chart_display_type_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_chart_display_type_key: {
        type: ORM.STRING(100),
        allowNull: false
    },
    trendata_chart_display_type_title: {
        type: ORM.STRING(100),
        allowNull: false
    },
    trendata_chart_display_type_description: {
        type: ORM.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'trendata_chart_display_type',
    name: {
        singular: 'ChartDisplayType',
        plural: 'ChartDisplayTypes'
    }
});

/**
 * Country
 * @type {Model}
 */
models.Country = orm.define('Country', {
    trendata_country_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_country_name: {
        type: ORM.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'trendata_country',
    name: {
        singular: 'Country',
        plural: 'Countries'
    }
});

/**
 * Dashboard
 * @type {Model}
 */
models.Dashboard = orm.define('Dashboard', {
    trendata_dashboard_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_user_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: '0'
    },
    trendata_dashboard_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_dashboard_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_dashboard_title_token: {
        type: ORM.STRING(36),
        allowNull: false
    },
    trendata_dashboard_description_token: {
        type: ORM.STRING(36),
        allowNull: false
    },
    trendata_dashboard_status: {
        type: ORM.ENUM,
        values: [
            '0',
            '1',
            '2'
        ],
        defaultValue: '1',
        allowNull: false,
        comment: '0: Inavtive; 1: Active; 2: Deleted'
    },
    trendata_dashboard_is_default: {
        type: ORM.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    trendata_dashboard_icon: {
        type: ORM.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'trendata_dashboard',
    name: {
        singular: 'Dashboard',
        plural: 'Dashboards'
    }
});

/**
 * DashboardChart
 * @type {Model}
 */
models.DashboardChart = orm.define('DashboardChart', {
    trendata_dashboard_chart_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_dashboard_chart_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_dashboard_chart_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_dashboard_chart_order: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_dashboard_chart_width: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_dashboard_chart_height: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    x: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    y: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_dashboard_chart_view: {
        type: ORM.STRING(255),
        allowNull: true
    },
    trendata_dashboard_chart_filters: {
        type: ORM.TEXT,
        allowNull: true
    },
    trendata_dashboard_chart_time_span: {
        type: ORM.STRING(255),
        allowNull: true
    },
    trendata_dashboard_chart_vertical_axis: {
        type: ORM.STRING(255),
        allowNull: true
    },
    trendata_dashboard_chart_title: {
        type: ORM.STRING(255),
        allowNull: true
    },
    trendata_dashboard_chart_description: {
        type: ORM.TEXT,
        allowNull: true
    },
    trendata_dashboard_chart_regression: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_dashboard_chart_hide_empty: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    }
}, {
    tableName: 'trendata_dashboard_chart',
    name: {
        singular: 'DashboardChart',
        plural: 'DashboardCharts'
    }
});

/**
 * EmailTemplate
 * @type {Model}
 */
models.EmailTemplate = orm.define('EmailTemplate', {
    trendata_email_template_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_email_template_key: {
        type: ORM.STRING(100),
        allowNull: false
    },
    trendata_email_subject_token: {
        type: ORM.STRING(64),
        allowNull: false
    },
    trendata_email_msg_token: {
        type: ORM.STRING(64),
        allowNull: false
    }
}, {
    tableName: 'trendata_email_template',
    name: {
        singular: 'EmailTemplate',
        plural: 'EmailTemplates'
    }
});

/**
 * Event
 * @type {Model}
 */
models.Event = orm.define('Event', {
    trendata_event_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_event_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_event_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    // ***
    /*trendata_event_category_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },*/
    trendata_event_title_token: {
        type: ORM.STRING(36),
        allowNull: false
    },
    trendata_event_description_token: {
        type: ORM.STRING(36),
        allowNull: false
    },
    trendata_event_start_on: {
        type: ORM.DATEONLY,
        allowNull: false
    },
    trendata_event_end_on: {
        type: ORM.DATEONLY,
        allowNull: false
    },
    trendata_event_is_public: {
        type: ORM.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '0: Private ; 1: Public'
    },
    trendata_event_status: {
        type: ORM.ENUM,
        values: [
            '0',
            '1',
            '2'
        ],
        defaultValue: '1',
        allowNull: false,
        comment: '0: Inactive; 1: Active; 2: Deleted'
    }
}, {
    tableName: 'trendata_event',
    name: {
        singular: 'Event',
        plural: 'Events'
    }
});

/**
 * EventCategory
 * @type {Model}
 */
models.EventCategory = orm.define('EventCategory', {
    trendata_event_category_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_event_category_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_event_category_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_event_category_title_token: {
        type: ORM.STRING(255),
        allowNull: false
    },
    trendata_event_category_description_token: {
        type: ORM.TEXT,
        allowNull: false
    },
    trendata_event_category_color_code: {
        type: ORM.STRING(10),
        allowNull: false
    },
    trendata_event_category_order: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    tableName: 'trendata_event_category',
    name: {
        singular: 'EventCategory',
        plural: 'EventCategorys'
    }
});

/**
 * FinancialData
 * @type {Model}
 */
models.FinancialData = orm.define('FinancialData', {
    trendata_financial_data_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_financial_data_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_financial_data_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_financial_data_year: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    },
    trendata_financial_data_json_data: {
        type: ORM.TEXT,
        allowNull: false
    }
}, {
    tableName: 'trendata_financial_data',
    name: {
        singular: 'FinancialData',
        plural: 'FinancialDatas'
    },
    indexes: [
        {
            unique: false,
            fields: [
                'trendata_financial_data_year'
            ]
        }
    ]
});

/**
 * Language
 * @type {Model}
 */
models.Language = orm.define('Language', {
    trendata_language_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_language_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_language_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_language_key: {
        type: ORM.STRING(5),
        allowNull: false
    },
    trendata_language_title: {
        type: ORM.STRING(100),
        allowNull: false
    },
    trendata_language_description: {
        type: ORM.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'trendata_language',
    name: {
        singular: 'Language',
        plural: 'Languages'
    }
});

/**
 * LoginDetail
 * @type {Model}
 */
models.LoginDetail = orm.define('LoginDetail', {
    trendata_login_details_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    // ***
    /*trendata_login_details_user_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },*/
    trendata_login_details_auth_token: {
        type: ORM.TEXT,
        allowNull: true
    },
    trendata_login_details_ip_address: {
        type: ORM.STRING(50),
        allowNull: true
    },
    trendata_login_details_login_time: {
        type: ORM.DATE,
        allowNull: true
    },
    trendata_login_details_logout_time: {
        type: ORM.DATE,
        allowNull: true
    }
}, {
    tableName: 'trendata_login_details',
    name: {
        singular: 'LoginDetail',
        plural: 'LoginDetails'
    }
});

/**
 * Menu
 * @type {Model}
 */
models.Menu = orm.define('Menu', {
    trendata_menu_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_menu_pid: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    },
    trendata_menu_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_menu_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_menu_title_token: {
        type: ORM.STRING(36),
        allowNull: false
    },
    trendata_menu_description_token: {
        type: ORM.STRING(36),
        allowNull: false
    },
    trendata_menu_redirect_path: {
        type: ORM.STRING(1000),
        allowNull: false
    }
}, {
    tableName: 'trendata_menu',
    name: {
        singular: 'Menu',
        plural: 'Menus'
    }
});

/**
 * MenuPermission
 * @type {Model}
 */
models.MenuPermission = orm.define('MenuPermission', {
    trendata_menu_permission_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_menu_permission_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_menu_permission_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    // ***
    /*trendata_role_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },*/
    // ***
    /*trendata_menu_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },*/
    // ***
    /*trendata_permission_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    }*/
}, {
    tableName: 'trendata_menu_permission',
    name: {
        singular: 'MenuPermission',
        plural: 'MenuPermissions'
    }
});

/**
 * Metric
 * @type {Model}
 */
models.Metric = orm.define('trendata_metric', {
    trendata_metric_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_metric_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_metric_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_metric_title_token: {
        type: ORM.STRING(36),
        allowNull: false
    },
    trendata_metric_description_token: {
        type: ORM.STRING(36),
        allowNull: false
    },
    trendata_metric_status: {
        type: ORM.ENUM,
        values: [
            '0',
            '1',
            '2'
        ],
        defaultValue: '1',
        allowNull: false,
        comment: '0: Inavtive; 1: Active; 2: Deleted'
    },
    trendata_metric_icon: {
        type: ORM.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'trendata_metric',
    name: {
        singular: 'Metric',
        plural: 'Metrics'
    }
});

/**
 * MetricChart
 * @type {Model}
 */
models.MetricChart = orm.define('MetricChart', {
    trendata_metric_chart_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_metric_chart_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_metric_chart_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    // ***
    /*trendata_metric_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },*/
    // ***
    /*trendata_chart_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },*/
    trendata_metric_chart_order: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    tableName: 'trendata_metric_chart',
    name: {
        singular: 'MetricChart',
        plural: 'MetricCharts'
    }
});

/**
 * Permission
 * @type {Model}
 */
models.Permission = orm.define('Permission', {
    trendata_permission_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_permission_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_permission_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_permission_title: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    },
    trendata_permission_description: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    tableName: 'trendata_permission',
    name: {
        singular: 'Permission',
        plural: 'Permissions'
    }
});

/**
 * Role
 * @type {Model}
 */
models.Role = orm.define('Role', {
    trendata_role_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_role_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_role_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_role_name: {
        type: ORM.STRING(100),
        allowNull: false
    },
    trendata_role_status: {
        type: ORM.ENUM,
        values: [
            '0',
            '1',
            '2'
        ],
        defaultValue: '1',
        allowNull: false,
        comment: '0: Inavtive; 1: Active; 2: Deleted'
    }
}, {
    tableName: 'trendata_role',
    name: {
        singular: 'Role',
        plural: 'Roles'
    }
});

/**
 * RoleMetric
 * @type {Model}
 */
models.RoleMetric = orm.define('RoleMetric', {
    trendata_role_metric_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_role_metric_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_role_metric_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    // ***
    /*trendata_role_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },*/
    // ***
    /*trendata_metric_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    }*/
}, {
    tableName: 'trendata_role_metric',
    name: {
        singular: 'RoleMetric',
        plural: 'RoleMetrics'
    }
});

/**
 * Tag
 * @type {Model}
 */
models.Tag = orm.define('Tag', {
    trendata_tag_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_tag_title: {
        type: ORM.STRING(255),
        allowNull: false
    },
    trendata_tag_description: {
        type: ORM.TEXT,
        allowNull: false
    },
    trendata_tag_status: {
        type: ORM.ENUM,
        values: [
            '0',
            '1',
            '2'
        ],
        defaultValue: '1',
        allowNull: false,
        comment: '0: Inavtive; 1: Active; 2: Deleted'
    }
}, {
    tableName: 'trendata_tag',
    name: {
        singular: 'Tag',
        plural: 'Tags'
    }
});

/**
 * Chart
 * @type {Model}
 */
models.Chart = orm.define('Chart', {
    trendata_chart_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_chart_key: {
        type: ORM.STRING(100),
        allowNull: true
    },
    trendata_chart_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_chart_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_chart_title_token: {
        type: ORM.STRING(127),
        allowNull: false
    },
    nlp_search_query: {
        type: ORM.STRING(50),
        allowNull: false
    },
    trendata_chart_description_token: {
        type: ORM.STRING(127),
        allowNull: false
    },
    trendata_chart_status: {
        type: ORM.ENUM,
        values: [
            '0',
            '1',
            '2'
        ],
        defaultValue: '1',
        allowNull: false,
        comment: '0: Inavtive; 1: Active; 2: Deleted'
    },
    trendata_chart_position_x: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    trendata_chart_position_y: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    trendata_chart_width: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 3
    },
    trendata_chart_height: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 4
    },
    trendata_chart_type: {
        type: ORM.ENUM,
        values: [
            '1',
            '2',
            '3'
        ],
        defaultValue: '1',
        allowNull: false,
        comment: '1: Chart Type; 2: value box; 3: Table'
    },
    // ***
    trendata_chart_default_chart_display_type: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 4
    },
    trendata_chart_view: {
        type: ORM.STRING(255),
        allowNull: false,
        defaultValue: 'gender'
    },
    trendata_chart_available_views: {
        type: ORM.STRING(255),
        allowNull: false,
        defaultValue: 'total'
    },
    trendata_chart_is_kueri: {
        type: ORM.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },
    /*trendata_chart_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    }*/
}, {
    tableName: 'trendata_chart',
    name: {
        singular: 'Chart',
        plural: 'Charts'
    }
});

/**
 * ChartType
 * @type {Model}
 */
models.ChartType = orm.define('ChartType', {
    trendata_chart_type_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_chart_type_name: {
        type: ORM.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'trendata_chart_type',
    name: {
        singular: 'ChartType',
        plural: 'ChartTypes'
    },
    indexes: [
        {
            unique: true,
            fields: [
                'trendata_chart_type_name'
            ]
        }
    ]
});

/**
 * ChartTag
 * @type {Model}
 */
models.ChartTag = orm.define('ChartTag', {
    trendata_chart_tag_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_chart_tag_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_chart_tag_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },/*
    // ***
    trendata_chart_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    },
    // ***
    trendata_tag_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    }*/
}, {
    tableName: 'trendata_chart_tag',
    name: {
        singular: 'ChartTag',
        plural: 'ChartTags'
    }
});

/**
 * Translation
 * @type {Model}
 */
models.Translation = orm.define('Translation', {
    trendata_translation_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    // ***
    /*trendata_language_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: 1
    },*/
    trendata_translation_text: {
        type: ORM.TEXT,
        allowNull: true
    },
    trendata_translation_token: {
        type: ORM.STRING(36),
        allowNull: false
    }
}, {
    tableName: 'trendata_translation',
    name: {
        singular: 'Translation',
        plural: 'Translations'
    },
    indexes: [
        {
            unique: false,
            fields: [
                'trendata_translation_token'
            ]
        }
    ],
    classMethods: {
        /**
         * @param token
         * @param langId
         * @returns {Promise}
         */
        getTranslation: function (token, langId) {
            var cacheToken = 'token_' + langId + '_' + token;

            if (undefined !== translationsCache[cacheToken]) {
                return Promise.resolve(translationsCache[cacheToken]);
            }

            return models.Translation.findAll({
                where: {
                    trendata_translation_token: token
                }
            }).reduce(function (accumulator, item) {
                if (1 == item.trendata_language_id) {
                    accumulator.defaultLangTitle = item.trendata_translation_text;
                }

                if (langId == item.trendata_language_id) {
                    accumulator.selectedLangTitle = item.trendata_translation_text;
                }

                return accumulator;
            }, {
                defaultLangTitle: null,
                selectedLangTitle: null
            }).then(function (data) {
                return translationsCache[cacheToken] = data.selectedLangTitle
                    ? data.selectedLangTitle
                    : (data.defaultLangTitle ? data.defaultLangTitle : null);
            });
        }
    }
});

/**
 *
 * @type {Model}
 */
models.User = orm.define('User', {
    trendata_user_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    // ***
    /*trendata_user_language_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },*/
    trendata_user_firstname: {
        type: ORM.STRING(100),
        allowNull: false
    },
    trendata_user_middlename: {
        type: ORM.STRING(100),
        allowNull: false
    },
    trendata_user_lastname: {
        type: ORM.STRING(100),
        allowNull: false
    },
    trendata_user_email: {
        type: ORM.STRING(100),
        allowNull: false
    },
    trendata_user_dob: {
        type: ORM.DATEONLY,
        allowNull: false
    },
    trendata_user_status: {
        type: ORM.ENUM,
        values: [
            '0',
            '1',
            '2'
        ],
        defaultValue: '1',
        allowNull: false,
        comment: '0: Inavtive; 1: Active; 2: Deleted'
    },
    trendata_user_designation: {
        type: ORM.STRING(255),
        allowNull: false
    },
    trendata_user_profile_image: {
        type: ORM.STRING(255),
        allowNull: false
    },
    trendata_user_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_user_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_user_salt: {
        type: ORM.STRING(100),
        allowNull: false
    },
    trendata_user_password: {
        type: ORM.TEXT,
        allowNull: false
    },
    trendata_user_reset_password_token: {
        type: ORM.STRING(50),
        allowNull: false
    },
    trendata_user_reset_password_expiry: {
        type: ORM.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'trendata_user',
    name: {
        singular: 'User',
        plural: 'Users'
    },
    instanceMethods: {
        /**
         * @param password
         */
        setPassword: function (password) {
            this.setDataValue(
                'trendata_user_password',
                crypto.pbkdf2Sync(password, this.trendata_user_salt, 1000, 64, 'sha1').toString('hex')
            );
        },

        /**
         * @param password
         */
        validatePassword: function (password) {
            var salt = this.trendata_user_salt;
            var hash = this.trendata_user_password;
            return hash === crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha1').toString('hex');
        }
    }
});

/**
 * UserAddress
 * @type {Model}
 */
models.UserAddress = orm.define('UserAddress', {
    trendata_user_address_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    // ***
    /*trendata_user_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },*/
    trendata_user_address_city: {
        type: ORM.STRING(100),
        allowNull: false
    },
    trendata_user_address_state: {
        type: ORM.STRING(100),
        allowNull: false
    },
    trendata_user_address_one: {
        type: ORM.STRING(255),
        allowNull: false
    },
    trendata_user_address_two: {
        type: ORM.STRING(255),
        allowNull: false
    },
    trendata_user_address_zipcode: {
        type: ORM.STRING(10),
        allowNull: false
    },
    // ***
    /*trendata_country_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    }*/
}, {
    tableName: 'trendata_user_address',
    name: {
        singular: 'UserAddress',
        plural: 'UserAddresses'
    }
});

/**
 * UserRole
 * @type {Model}
 */
models.UserRole = orm.define('UserRole', {
    trendata_user_role_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_user_role_created_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_user_role_last_modified_by: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    // ***
    /*trendata_user_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },*/
    // ***
    /*trendata_role_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },*/
    trendata_user_role_status: {
        type: ORM.ENUM,
        values: [
            '0',
            '1',
            '2'
        ],
        defaultValue: '1',
        allowNull: false,
        comment: '0: Inavtive; 1: Active; 2: Deleted'
    }

}, {
    tableName: 'trendata_user_role',
    name: {
        singular: 'UserRole',
        plural: 'UserRoles'
    }
});

/**
 * SqlQuery
 * @type {Model}
 */
models.SqlQuery = orm.define('SqlQuery', {
    trendata_sql_query_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_sql_query_template: {
        type: ORM.TEXT,
        allowNull: true
    },
    trendata_sql_query_custom_source: {
        type: ORM.TEXT,
        allowNull: true
    },
    trendata_sql_query_module_path: {
        type: ORM.STRING(255),
        allowNull: true
    },
    /*trendata_chart_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    }*/
}, {
    tableName: 'trendata_sql_query',
    name: {
        singular: 'SqlQuery',
        plural: 'SqlQueries'
    }
});

/**
 * ConnectorCsv
 * @type {Model}
 */
models.ConnectorCsv = orm.define('ConnectorCsv', {
    trendata_connector_csv_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_connector_csv_type: {
        type: ORM.STRING(255),
        allowNull: false
    },
    trendata_connector_csv_file_type: {
        type: ORM.STRING(255),
        allowNull: false
    },
    trendata_connector_csv_filename: {
        type: ORM.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'trendata_connector_csv',
    name: {
        singular: 'ConnectorCsv',
        plural: 'ConnectorCsvs'
    }
});

/**
 * UserActivity
 * @type {Model}
 */
models.UserActivity = orm.define('UserActivity', {
    trendata_user_activity_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_user_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_user_api_execution_time: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: true
    },
    trendata_user_api_error_message: {
        type: ORM.TEXT,
        allowNull: true
    },
    trendata_user_activity_ip_address: {
        type: ORM.STRING(255),
        allowNull: true
    },
    trendata_user_activity_url: {
        type: ORM.STRING(255),
        allowNull: true
    },
    trendata_user_activity_referrer_page: {
        type: ORM.STRING(255),
        allowNull: true
    },
    trendata_user_activity_browser: {
        type: ORM.STRING(255),
        allowNull: true
    },
    trendata_user_activity_session_id: {
        type: ORM.STRING(511),
        allowNull: true
    },
    trendata_user_activity_type: {
        type: ORM.ENUM,
        values: [
            'page-call',
            'api-call'
        ],
        defaultValue: 'page-call',
        allowNull: false
    }
}, {
    tableName: 'trendata_user_activity',
    name: {
        singular: 'UserActivity',
        plural: 'UserActivities'
    }
});

/**
 * Settings
 * @type {Model}
 */
models.Setting = orm.define('Setting', {
    trendata_setting_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_setting_name: {
        type: ORM.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'trendata_setting',
    name: {
        singular: 'Setting',
        plural: 'Settings'
    }
});

/**
 * Settings
 * @type {Model}
 */
models.SettingValue = orm.define('SettingValue', {
    trendata_setting_value_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_setting_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    },
    trendata_setting_value: {
        type: ORM.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'trendata_setting_value',
    name: {
        singular: 'SettingValue',
        plural: 'SettingValues'
    }
});

/**
 * Video
 * @type {Model}
 */
models.Video = orm.define('Video', {
    trendata_video_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_video_url: {
        type: ORM.STRING(255),
        allowNull: false
    },
    trendata_video_video: {
        type: ORM.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'trendata_video',
    name: {
        singular: 'Video',
        plural: 'Videos'
    }
});

/**
 * Users grid settings
 * @type {Model}
 */
models.UsersGridSettings = orm.define('UsersGridSettings', {
    trendata_users_grid_settings_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_users_grid_settings_user_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    },
    trendata_users_grid_settings_chart_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    },
    trendata_users_grid_settings_fields: {
        type: ORM.STRING(255),
        allowNull: false,
        defaultValue: 'full name,location,manager,department'
    }
}, {
    tableName: 'trendata_users_grid_settings',
    name: {
        singular: 'UsersGridSettings',
        plural: 'UsersGridSettings'
    }
});

/**
 * Performance
 * @type {Model}
 */
models.Performance = orm.define('Performance', {
    trendata_performance_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_performance_title: {
        type: ORM.STRING(255),
        allowNull: false
    },
    trendata_performance_value: {
        type: ORM.FLOAT(2, 1),
        allowNull: false
    }
}, {
    tableName: 'trendata_performance',
    name: {
        singular: 'Performance',
        plural: 'Performacnes'
    }
});

/**
 * Alerts
 * @type {Model}
 */
models.Alert = orm.define('Alert', {
    trendata_alert_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_alert_name: {
        type: ORM.STRING(255),
        allowNull: false
    },
    trendata_alert_type: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    },
    trendata_alert_user_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    },
    trendata_alert_criteria: {
        type: ORM.STRING(255),
        allowNull: true
    },
    trendata_alert_chart_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    },
    trendata_alert_chart_type_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false
    },
    trendata_alert_chart_view: {
        type: ORM.STRING(255),
        allowNull: true
    },
    trendata_alert_chart_view_item: {
        type: ORM.STRING(255),
        allowNull: true
    },
    trendata_alert_trigger: {
        type: ORM.STRING(255),
        allowNull: false
    },
    trendata_alert_status: {
        type: ORM.INTEGER.UNSIGNED,
        defaultValue: 1
    },
    trendata_alert_filters: {
        type: ORM.TEXT,
        allowNull: true
    },
    trendata_alert_condition: {
        type: ORM.STRING(255),
        allowNull: true
    },
    trendata_alert_value: {
        type: ORM.FLOAT(10, 2),
        allowNull: true
    },
    trendata_alert_points: {
        type: ORM.STRING(255),
        allowNull: true
    },
    trendata_alert_date: {
        type: ORM.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'trendata_alert',
    name: {
        singular: 'Alert',
        plural: 'Alerts'
    }
});


/**
 * Performance
 * @type {Model}
 */
models.Performance = orm.define('Performance', {
    trendata_performance_id: {
        type: ORM.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trendata_performance_title: {
        type: ORM.STRING(255),
        allowNull: false
    },
    trendata_performance_value: {
        type: ORM.FLOAT(2, 1),
        allowNull: false
    }
}, {
    tableName: 'trendata_performance',
    name: {
        singular: 'Performance',
        plural: 'Performacnes'
    }
});

/* ===================================================== Relations ================================================== */

/**
 *
 */

models.User.hasOne(models.Dashboard, {
    foreignKey: 'trendata_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});



/**
 *
 */
models.DashboardChart.belongsTo(models.Dashboard, {
    foreignKey: 'trendata_dashboard_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Dashboard.hasMany(models.DashboardChart, {
    foreignKey: 'trendata_dashboard_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.DashboardChart.belongsTo(models.Chart, {
    foreignKey: 'trendata_chart_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Chart.hasMany(models.DashboardChart, {
    foreignKey: 'trendata_chart_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.Event.belongsTo(models.EventCategory, {
    foreignKey: 'trendata_event_category_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.EventCategory.hasMany(models.Event, {
    foreignKey: 'trendata_event_category_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 * trendata_login_details_user_id
 */
models.LoginDetail.belongsTo(models.User, {
    foreignKey: 'trendata_login_details_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.User.hasMany(models.LoginDetail, {
    foreignKey: 'trendata_login_details_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.MenuPermission.belongsTo(models.Role, {
    foreignKey: 'trendata_role_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Role.hasMany(models.MenuPermission, {
    foreignKey: 'trendata_role_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.MenuPermission.belongsTo(models.Menu, {
    foreignKey: 'trendata_menu_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Menu.hasMany(models.MenuPermission, {
    foreignKey: 'trendata_menu_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.MenuPermission.belongsTo(models.Permission, {
    foreignKey: 'trendata_permission_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Permission.hasMany(models.MenuPermission, {
    foreignKey: 'trendata_permission_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.MetricChart.belongsTo(models.Metric, {
    foreignKey: 'trendata_metric_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Metric.hasMany(models.MetricChart, {
    foreignKey: 'trendata_metric_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.MetricChart.belongsTo(models.Chart, {
    foreignKey: 'trendata_chart_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Chart.hasMany(models.MetricChart, {
    foreignKey: 'trendata_chart_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.RoleMetric.belongsTo(models.Role, {
    foreignKey: 'trendata_role_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Role.hasMany(models.RoleMetric, {
    foreignKey: 'trendata_role_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.RoleMetric.belongsTo(models.Metric, {
    foreignKey: 'trendata_metric_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Metric.hasMany(models.RoleMetric, {
    foreignKey: 'trendata_metric_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.Chart.belongsTo(models.ChartDisplayType, {
    foreignKey: 'trendata_chart_default_chart_display_type',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.ChartDisplayType.hasMany(models.Chart, {
    foreignKey: 'trendata_chart_default_chart_display_type',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.ChartTag.belongsTo(models.Chart, {
    foreignKey: 'trendata_chart_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Chart.hasMany(models.ChartTag, {
    foreignKey: 'trendata_chart_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.Chart.belongsTo(models.ChartType, {
    foreignKey: 'trendata_chart_type_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.ChartType.hasMany(models.Chart, {
    foreignKey: 'trendata_chart_type_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.Chart.belongsTo(models.Chart, {
    foreignKey: 'trendata_chart_id_parent',
    as: 'ParentChart',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Chart.hasMany(models.Chart, {
    foreignKey: 'trendata_chart_id_parent',
    as: 'ChildCharts',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.ChartTag.belongsTo(models.Tag, {
    foreignKey: 'trendata_tag_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Tag.hasMany(models.ChartTag, {
    foreignKey: 'trendata_tag_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.Translation.belongsTo(models.Language, {
    foreignKey: 'trendata_language_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Language.hasMany(models.Translation, {
    foreignKey: 'trendata_language_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.User.belongsTo(models.Language, {
    foreignKey: 'trendata_user_language_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Language.hasMany(models.User, {
    foreignKey: 'trendata_user_language_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.UserAddress.belongsTo(models.User, {
    foreignKey: 'trendata_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.User.hasMany(models.UserAddress, {
    foreignKey: 'trendata_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.UserAddress.belongsTo(models.Country, {
    foreignKey: 'trendata_country_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Country.hasMany(models.UserAddress, {
    foreignKey: 'trendata_country_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.UserRole.belongsTo(models.User, {
    foreignKey: 'trendata_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.User.hasMany(models.UserRole, {
    foreignKey: 'trendata_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.UserRole.belongsTo(models.Role, {
    foreignKey: 'trendata_role_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Role.hasMany(models.UserRole, {
    foreignKey: 'trendata_role_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.SqlQuery.belongsTo(models.Chart, {
    foreignKey: 'trendata_chart_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Chart.hasOne(models.SqlQuery, {
    foreignKey: 'trendata_chart_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.ConnectorCsv.belongsTo(models.User, {
    foreignKey: 'trendata_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.User.hasMany(models.ConnectorCsv, {
    foreignKey: 'trendata_user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/**
 *
 */
models.SettingValue.belongsTo(models.Setting, {
    foreignKey: 'trendata_setting_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
models.Setting.hasMany(models.SettingValue, {
    foreignKey: 'trendata_setting_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

/* ================================================================================================================== */

/*orm.sync({
    force: true
});*/

module.exports = models;
