let knex = require('./knex');
let pluralize = require('pluralize');

module.exports = {
    createRedirectData: createRedirectData,
}

let chartRedCities = [
    {query: "how many people left last month in #c?", redirect: '{"chart": "7", "type": "drill-down", "chart_view": "city", "filters": {"city":["#f"]}}'},
];

let chartRedTemplate = {
    "number_of_employee": [
        {query: "how many employees are there by #v?", redirect: '{"chart": "61", "type": "drill-down", "chart_view": "#k"}'},
        {query: "who are my high performers by all #v?", redirect: '{"chart": "61", "type": "drill-down", "chart_view": "#k", "filters": {"performance": ["4","5"]}}', plural: true},
        {query: "show high performers by all #v", redirect: '{"chart": "61", "type": "drill-down", "chart_view": "#k", "filters": {"performance": ["4","5"]}}', plural: true},
        {query: "show me the number of employees by #v", redirect: '{"chart": "61", "type": "drill-down", "chart_view": "#k"}'},
    ],
    "3583300f-1899-4643-8b6d-6a12e28da956": [
        {query: "what's the average performance score in all #v?", redirect: '{"chart": "29", "type": "drill-down", "chart_view": "#k"}', plural: true},
        {query: "show me the average performance score by #v?", redirect: '{"chart": "29", "type": "drill-down", "chart_view": "#k"}'},

    ],
    "16395b33-b1c7-413a-9d60-16b59119c0e7": [
        {query: "what's the turnover rate by #v?", redirect: '{"chart": "7", "type": "drill-down", "chart_view": "#k", "vertical-axis":"Percentage (%)"}'},
    ],
    "revenue_per_employee": [],
    "6a508904e34446978168a63ea50d8adf": [
        {query: "what's the average cost per hire by #v?", redirect: '{"chart": "59", "type": "drill-down", "chart_view": "#k"}'},
        {query: "show the average cost per hire by #v", redirect: '{"chart": "59", "type": "drill-down", "chart_view": "#k"}'},
        {query: "Which #v has the highest cost per hire?", redirect: '{"chart": "59", "type": "drill-down", "chart_view": "#k", "highest": true}'},
    ],
    "absences_average": [
        {query: "what's the average absences in all #v?", redirect: '{"chart": "73", "type": "drill-down", "chart_view": "#k"}', plural: true},
        {query: "show average absences by all #v", redirect: '{"chart": "73", "type": "drill-down", "chart_view": "#k"}', plural: true},
    ],
    "602ceaec98474415b8e8efe9b485b53d": [
        {query: "what' the average compensation by #v?", redirect: '{"chart": "60", "type": "drill-down", "chart_view": "#k", "chart_filter": ["Average Salary"]}'},
        {query: "show me average compensation by all #v", redirect: '{"chart": "60", "type": "drill-down", "chart_view": "#k", "chart_filter": ["Average Salary"]}', plural: true},
        {query: "what' the average compensation by #v compared to industry average?", redirect: '{"chart": "60", "type": "drill-down", "chart_view": "#k"}'},
    ],
    "5bde7342-bfc9-45a3-b4d8-4e4e3156b7d7": [
        {query: "what's the average benefit cost by #v?", redirect: '{"chart": "17", "type": "drill-down", "chart_view": "#k"}'},
    ],
    "professional_development": [
        {query: "show the number of employees in professional development by #v", redirect: '{"chart": "74", "type": "drill-down", "chart_view": "#k"}'},
    ],
    "8736c65c-f63a-463b-a1d3-8769bd869555": [
        {query: "which source of hire is the best by #v?", redirect: '{"chart": "55", "type": "drill-down", "chart_view": "#k", "filters": {"performance": ["4","5"]}}'},
        {query: "what's the best source of hire by #v?", redirect: '{"chart": "55", "type": "drill-down", "chart_view": "#k", "filters": {"performance": ["4","5"]}}'},
    ],
    "successors_identified": [
        {query: "which positions have successors by #v?", redirect: '{"chart": "75", "type": "drill-down", "chart_view": "#k"}'},
        {query: "show positions that have successors by #v", redirect: '{"chart": "75", "type": "drill-down", "chart_view": "#k"}'},
    ],
    "b550e591-c278-42fe-aff3-8594888605c8": [
        {query: "what's the average tenure in #v?", redirect: '{"chart": "30", "type": "drill-down", "chart_view": "#k"}'},
        {query: "show me the average tenure by #v?", redirect: '{"chart": "30", "type": "drill-down", "chart_view": "#k"}'},
    ],
    "d3ae9c70801a4560a810628f3b3f660a": [
        {query: "what's the average time to fill by #v?", redirect: '{"chart": "58", "type": "drill-down", "chart_view": "#k"}'},
        {query: "show average time to fill by #v?", redirect: '{"chart": "58", "type": "drill-down", "chart_view": "#k"}'},
        {query: "which by #v has the longest time to fill open positions?", redirect: '{"chart": "58", "type": "drill-down", "chart_view": "#k", "highest": true}'},
        {query: "how long does it take to fill an open position by #v?", redirect: '{"chart": "58", "type": "drill-down", "chart_view": "#k"}'},
    ],
    "hires_vs_terminations": [
        {query: "how many people were hired by #v?", redirect: '{"chart": "96", "type": "drill-down", "chart_view": "#k", "chart_filter": ["Hires"]}'},
        {query: "show number of people hired by #v", redirect: '{"chart": "96", "type": "drill-down", "chart_view": "#k", "chart_filter": ["Hires"]}'},
        {query: "how many employees did we hire last month by all #v?", redirect: '{"chart": "96", "type": "drill-down", "chart_view": "#k", "chart_filter": ["Hires"]}', plural: true},
        {query: "show all hires last month by #v", redirect: '{"chart": "96", "type": "drill-down", "chart_view": "#k", "chart_filter": ["Hires"]}'},
        {query: "how many employees did we terminate by all #v?", redirect: '{"chart": "96", "type": "drill-down", "chart_view": "#k", "chart_filter": ["Terminations"]}', plural: true},
        {query: "show all terminations last month by #v", redirect: '{"chart": "96", "type": "drill-down", "chart_view": "#k", "chart_filter": ["Terminations"]}'},
    ],
    "average_age": [
        {query: "what's the average age by #v?", redirect: '{"chart": "99", "type": "drill-down", "chart_view": "#k"}'},
        {query: "show me average age by all #v", redirect: '{"chart": "99", "type": "drill-down", "chart_view": "#k"}', plural: true},
    ],
    "ethnic_diversity": [
        {query: "what's the diversity break down by #v?", redirect: '{"chart": "102", "type": "drill-down", "chart_view": "#k"}'},
        {query: "show the diversity by all #v", redirect: '{"chart": "102", "type": "drill-down", "chart_view": "#k"}', plural: true},
        {query: "what's the percentage of Africa American by #v?", redirect: '{"chart": "102", "type": "drill-down", "chart_view": "#k", "chart_filter": ["Asian", "Latino", "White"], "vertical-axis":"Percentage (%)"}'},
    ],
    "reports_per_manager": [
        {query: "what's the average number of reports per manager by all #v?", redirect: '{"chart": "105", "type": "drill-down", "chart_view": "#k"}', plural: true},
        {query: "show the average number of reports per manager by #v", redirect: '{"chart": "105", "type": "drill-down", "chart_view": "#k"}'},
    ],
};

function createRedirectData() {
    let chartsRedirect = [
        {'trendata_nlp_sentence_query': "how many employees are there versus last year", 'trendata_nlp_sentence_redirect': '{"chart": "61", "type": "analytics", "chart_view": null}'},
        {'trendata_nlp_sentence_query': "who are my top performers?", 'trendata_nlp_sentence_redirect': '{"chart": "61", "type": "drill-down", "chart_view": "performance", "filters": {"performance": ["4","5"]}}'},
        {'trendata_nlp_sentence_query': "which department has the most high performers?", 'trendata_nlp_sentence_redirect': '{"chart": "61", "type": "drill-down", "chart_view": "department", "filters": {"performance": ["5"]}}'},
        {'trendata_nlp_sentence_query': "show me the number of employees by Division.", 'trendata_nlp_sentence_redirect': '{"chart": "61", "type": "drill-down", "chart_view": "division"}'},
        {'trendata_nlp_sentence_query': "how many female managers do we have?", 'trendata_nlp_sentence_redirect': '{"chart": "61", "type": "drill-down", "chart_view": "gender", "filters": {"gender": ["Female"], "job level": ["Manager"]}}'},
        {'trendata_nlp_sentence_query': "how many managers are in each department?", 'trendata_nlp_sentence_redirect': '{"chart": "61", "type": "drill-down", "chart_view": "department", "filters": {"job level": ["Manager"]}}'},
        {'trendata_nlp_sentence_query': "how many people commute over 20 miles?", 'trendata_nlp_sentence_redirect': '{"chart": "61", "type": "drill-down", "chart_view": "commute distance", "filters": {"commute distance": ["> 20"]}}'},

        {'trendata_nlp_sentence_query': "how is Turnover Trending?", 'trendata_nlp_sentence_redirect': '{"chart": 7, "type": "analytics", "chart_view": null}'},
        {'trendata_nlp_sentence_query': "show me turnover by division?", 'trendata_nlp_sentence_redirect': '{"chart": 7, "type": "drill-down", "chart_view": "division"}'},
        {'trendata_nlp_sentence_query': "which division has the highest turnover rate?", 'trendata_nlp_sentence_redirect': '{"chart": 7, "type": "drill-down", "chart_view": "division", "filters": {"division": ["A","D"]}}'},
        {'trendata_nlp_sentence_query': "which Job Level has the highest turnover rate?", 'trendata_nlp_sentence_redirect': '{"chart": 7, "type": "drill-down", "chart_view": "job level", "highest": true}'},
        {'trendata_nlp_sentence_query': "how many people quit last month?", 'trendata_nlp_sentence_redirect': '{"chart": 7, "type": "drill-down", "chart_view": "separation type"}'},
        {'trendata_nlp_sentence_query': "do I have a turnover problem?", 'trendata_nlp_sentence_redirect': '{"chart": 7, "type": "analytics", "chart_view": "separation type"}'},

        {'trendata_nlp_sentence_query': "what's the average tenure in us?", 'trendata_nlp_sentence_redirect': '{"chart": "30", "type": "drill-down", "chart_view": "country", "filters": {"country": "USA"}}'},
        {'trendata_nlp_sentence_query': "what's the average tenure for vice president?", 'trendata_nlp_sentence_redirect': '{"chart": "30", "type": "drill-down", "chart_view": "job level", "filters": {"job level": ["Vice President"]}}'},
        {'trendata_nlp_sentence_query': "what's the average tenure for top performers?", 'trendata_nlp_sentence_redirect': '{"chart": "30", "type": "drill-down", "chart_view": "performance", "filters": {"performance": ["4","5"]}}'},
        {'trendata_nlp_sentence_query': "who are my longest serving employees?", 'trendata_nlp_sentence_redirect': '{"chart": "30", "type": "drill-down", "chart_view": null, "chart_filter": ["<20",">20"]}'},

        {'trendata_nlp_sentence_query': "what are my hires vs termination for the last year?", 'trendata_nlp_sentence_redirect': '{"chart": "96", "type": "analytics", "chart_view": null}'},

        {'trendata_nlp_sentence_query': "what's the effect of commute distance on absences?", 'trendata_nlp_sentence_redirect': '{"chart": "73", "type": "drill-down", "chart_view": "commute distance"}'},
        {'trendata_nlp_sentence_query': "which the effect of absences on performance?", 'trendata_nlp_sentence_redirect': '{"chart": "73", "type": "drill-down", "chart_view": "performance"}'},

        {'trendata_nlp_sentence_query': "what's the average time to fill for top performers?", 'trendata_nlp_sentence_redirect': '{"chart": "58", "type": "drill-down", "chart_view": "performance", "filters": {"performance": ["4","5"]}}'},

        {'trendata_nlp_sentence_query': "where do i get most of my managers from?", 'trendata_nlp_sentence_redirect': '{"chart": "55", "type": "drill-down", "chart_view": "job level", "filters": {"job level": ["Manager"]}}'},
        {'trendata_nlp_sentence_query': "where am i getting my top performers from?", 'trendata_nlp_sentence_redirect': '{"chart": "55", "type": "drill-down", "chart_view": "performance", "filters": {"performance": ["4","5"]}}'},

        {'trendata_nlp_sentence_query': "how many minority managers do we have?", 'trendata_nlp_sentence_redirect': '{"chart": "102", "type": "drill-down", "chart_view": "gender", "filters": {"job level": ["Manager"]}, "chart_filter": ["African American", "Asian", "Latino"]}'},
        {'trendata_nlp_sentence_query': "what's the percentage of managers that are not white?", 'trendata_nlp_sentence_redirect': '{"chart": "102", "type": "drill-down", "chart_view": "job level", "filters": {"job level": ["Manager"]}, "chart_filter": ["African American", "Asian", "Latino"], "vertical-axis":"Percentage (%)"}'},

        {'trendata_nlp_sentence_query': "who are my high performers by all cities?", 'trendata_nlp_sentence_redirect': '{"chart": "29", "type": "drill-down", "chart_view": "city", "filters": {"performance": ["4","5"]}}'},
    ];

    let chartsData = knex('trendata_chart')
        .select(['trendata_chart_title_token AS id', 'trendata_chart_available_views AS views'])
        .where('trendata_chart_type_id', 2);
    let customFields = knex('trendata_bigdata_custom_field').select(['trendata_bigdata_custom_field_name AS field']);
    let cities = knex('trendata_bigdata_user_view').select(['address_city AS city']).distinct();
    let deletedQuery = [
        "show me the average performance score by performance?",
        "who are my high performers by all performance?",
        "who are my high performers by all city?",
        "show high performers by all performance?",
    ];

    return knex('trendata_nlp_sentence').truncate().then(function() {

        return Promise.all([chartsData, customFields, cities])
            .spread(function (charts, fields, cities) {
                let customFields = [];
                let queryTemplate = '';
                let query = '';
                let redirect = '';
                let views = [];

                cities = _.map(cities, function(item) { return item.city; });
                customFields = _.map(fields, function(item) { return item.field;});
                fields = customFields.join(',');
                charts = _.map(charts, function(item) {
                    item.views = item.views + ',' + fields;

                    return item;
                });

                _.each(charts, function(chart) {
                    if (chartRedTemplate[chart.id] && chartRedTemplate[chart.id].length) {
                        views = chart.views.split(',');

                        _.each(chartRedTemplate[chart.id], function(template) {
                            _.each(views, function(viewChart) {
                                queryTemplate = viewChart.replace(/^custom_/gi, '').replace(/_/g, ' ');

                                if (template.plural) {
                                    queryTemplate = pluralText(queryTemplate);
                                }

                                query = template.query.replace(/#v/gi, queryTemplate.toLowerCase());
                                redirect = template.redirect.replace(/#k/gi, viewChart.toLowerCase());

                                if (deletedQuery.indexOf(query) === -1) {
                                    chartsRedirect.push({'trendata_nlp_sentence_query': query, 'trendata_nlp_sentence_redirect': redirect});
                                }
                            });
                        });
                    }
                });

                _.each(cities, function(city) {
                    _.each(chartRedCities, function(template) {
                        query = template.query.replace(/#c/gi, city.toLowerCase());
                        redirect = template.redirect.replace(/#f/gi, city);

                        chartsRedirect.push({'trendata_nlp_sentence_query': query, 'trendata_nlp_sentence_redirect': redirect});
                    });
                });

                return knex.insert(chartsRedirect, 'trendata_nlp_sentence_id').into('trendata_nlp_sentence');
            });
    })
    .catch(function(err) {
        console.error('-----------------------------------------------');
        console.error('Error create redirect query: ', err);
    });

}

function pluralText (text) {
    let number = text.match(/\s?\d+$/g);
    let position = null;
    let result = '';

    if (number === null) {
        result = pluralize.plural(text);
    } else {
        position = text.indexOf(number[0]);

        if (position !== -1) {
            result = text.substr(0, position);
            result = pluralize.plural(result);
            result += number[0];
        } else {
            result = pluralize.plural(text);
        }
    }

    return result;
}