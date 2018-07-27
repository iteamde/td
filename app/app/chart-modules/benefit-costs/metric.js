'use strict';

commonChartData.makeAccessLevelSql(req).then(function (accessLevelSql) {
    return Promise.props({
        /**
         *
         */
        costOfBenefit: (function () {
            var FinancialDataModel = ormModels.FinancialData;
            var date = moment().add(-req.query.end || -1, 'month');
            var month = date.format('M') - 1;

            return FinancialDataModel.findOne({
                where: {
                    trendata_financial_data_year: date.format('YYYY')
                }
            }).then(function (data) {
                if (! data) {
                    return 0;
                }

                var benefitCost = _.find(JSON.parse(data.trendata_financial_data_json_data), {title: 'Cost of Benefits'});
                return parseFloat(benefitCost && benefitCost.data && benefitCost.data[month] && benefitCost.data[month].value || 0);
            });
        })(),

        /**
         *
         */
        costOfBenefitFromTuff: orm.query(
            'SELECT ' +
            'SUM(`tbu`.`trendata_bigdata_user_benefit_costs`) as `sum` ' +
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
            return rows[0].sum;
        }),

        /**
         *
         */
        cashCompensation: orm.query(
            'SELECT ' +
            'ROUND(SUM(`tbu`.`trendata_bigdata_user_salary`), 0) as `avg` ' +
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
            return rows[0].avg;
        })
    });
}).then(function (data) {
    let check = data.costOfBenefitFromTuff || data.cashCompensation || data.costOfBenefit;
    _resolve({
        decimals: '2',
        data: check ? [
            {
                label: 'Cash compensation',
                value: null === data.costOfBenefitFromTuff ? data.cashCompensation / 12 : data.cashCompensation
            },
            {
                label: 'Cost of benefit',
                value: null === data.costOfBenefitFromTuff ? data.costOfBenefit : data.costOfBenefitFromTuff
            }
        ] : []
    });
}).catch(_reject);
