'use strict';

/**
 * @param number
 * @param decimals
 * @param dec_point
 * @param thousands_sep
 */
function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return Promise.props({
        /**
         *
         */
        users: (function () {
            return orm.query(
                'SELECT * ' +
                'FROM ' +
                '`trendata_bigdata_user` AS `tbu` ' +
                'INNER JOIN ' +
                '`trendata_bigdata_user_position` AS `tbup` ' +
                'ON ' +
                '`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` ' +
                'WHERE ' +
                '`tbup`.`trendata_bigdata_user_position_hire_date` >= DATE_FORMAT(NOW() + INTERVAL ? MONTH, \'%Y-%m-01\') ' +
                'AND ' +
                '`tbup`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') ' +
                'AND ' +
                accessLevelSql.query,
                {
                    type: ORM.QueryTypes.SELECT,
                    replacements: [
                        undefined === req.query.start ? -1 : -req.query.start,
                        undefined === req.query.end ? -1 : -req.query.end
                    ].concat(accessLevelSql.replacements)
                }
            );
        })(),

        /**
         *
         */
        value: (function () {
            var FinancialDataModel = ormModels.FinancialData;
            var currentDate = new Date();
            var lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 3);
            var valueYear = lastMonth.getFullYear();
            var valueMonth = lastMonth.getMonth();

            return FinancialDataModel.findOne({
                where: {
                    trendata_financial_data_year: valueYear
                }
            }).then(function (data) {
                if (! data) {
                    return 0;
                }

                var fromJson = JSON.parse(data.trendata_financial_data_json_data);
                var hiringCost = _.find(fromJson, {title: 'Hiring Costs'}).data;
                return parseInt(hiringCost && hiringCost[valueMonth] && hiringCost[valueMonth].value || 0);
            });
        })()
    });
}).then(function (data) {
    if (_.some(data.users, 'trendata_bigdata_user_cost_per_hire')) {
        data.value = 0;
        data.count = 0;
        _.each(data.users, function(user) {
            if (user.trendata_bigdata_user_cost_per_hire !== null) {
                data.value += +user.trendata_bigdata_user_cost_per_hire;
                data.count++;
            }
        });
    } else {
        data.count = data.users.length;
    }

    return data.count ? (Math.round((data.value / data.count) * 100) / 100) : 0;
}).then(function (value) {
    _resolve({
        data: [
            {
                label: '',
                value: '$' + number_format(value)
            }
        ]
    });
}).catch(_reject);
