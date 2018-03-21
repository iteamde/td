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
        users: orm.query(
            'SELECT ' +
            'COUNT(*) as `total_number_of_employees` ' +
            'FROM ' +
            '`trendata_bigdata_user` AS `tbu` ' +
            'WHERE ' +
            '((`tbu`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\') AND `tbu`.`trendata_bigdata_user_position_termination_date` >= DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\')) ' +
            'OR ' +
            '(`tbu`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbu`.`trendata_bigdata_user_position_hire_date` < DATE_FORMAT(NOW() + INTERVAL (? + 1) MONTH, \'%Y-%m-01\'))) ' +
            'AND ' +
            accessLevelSql.query,
            {
                type: ORM.QueryTypes.SELECT,
                replacements: [
                    -req.query.start || -1,
                    -req.query.end || -1,
                    -req.query.start || -1
                ].concat(accessLevelSql.replacements)
            }
        ).then(function (rows) {
            return rows[0]['total_number_of_employees'];
        }),

        /**
         *
         */
        value: (function () {
            var FinancialDataModel = ormModels.FinancialData;
            var lastMonth = moment().subtract(req.query.end || 1, 'month');
            var valueYear = lastMonth.format('YYYY');
            var valueMonth = lastMonth.format('M') - 1;

            return FinancialDataModel.findOne({
                where: {
                    trendata_financial_data_year: valueYear
                }
            }).then(function (data) {
                if (! data) {
                    return 0;
                }

                var value = JSON.parse(data.trendata_financial_data_json_data);
                return value && value[0] && value[0].data && value[0].data[valueMonth] && value[0].data[valueMonth].value || 0;
            });
        })()
    });
}).then(function (data) {
    return {
        users: parseInt(data.users) || 0,
        value: parseInt(data.value) || 0
    };
}).then(function (data) {
    _resolve({
        data: [
            {
                label: '',
                value: '$' + number_format(0 == data.users ? 0 : Math.round(data.value / data.users))
            }
        ]
    });
}).catch(_reject);
