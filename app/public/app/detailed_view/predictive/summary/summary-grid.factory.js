(function () {

    'use strict';

    angular
        .module('app.predictive')
        .factory('Summary', Summary);

    Summary.$inject = ['COST_PER_HIRE', 'ROW_NAMES'];

    function Summary(COST_PER_HIRE, ROW_NAMES) {

        function Summary (gridData) {
            this.data = gridData;
            this.init();
        }

        Summary.prototype = {

            init: function() {
                countPredictive(this.data);
                this.recount();
                this.defaultData = angular.copy(this.data);
                this.gridValues = createGridModel(this.data);
            },

            recount: function() {

                hpTurnover(this.data);
                nonHpTurnover(this.data);
                totalTurnover(this.data);
                numberOfEmployees(this.data);
                totalRecruitingCost(this.data);
                turnoverProductivityLoss(this.data);
                turnoverProdLossOfRev(this.data);
                companyRev(this.data);
                turnoverProdLossOfRev(this.data);

            },

            default: function () {
                this.data = angular.copy(this.defaultData);
            },

            recountPredictive: function (row, col) {

                var fields = [ROW_NAMES.avgSalary, ROW_NAMES.remoteEmployees, ROW_NAMES.hpInProfDev],
                    field = _.find(this.data, {name: fields[row]});
                for (var i = col - 1; i < 6; i++) {
                    var m = recountMonths(i);
                    field[m.nextMonth] = field[m.currentMonth] + (field[m.currentMonth] - field[m.halfYearAgoMonth]) / 6;
                }

                this.recount();
            },

            dataToArray: function() {

                var self = this;

                return _.map(this.data, function (obj1) {

                    var matchObj = _.find(self.data, {name: obj1.name});

                    return {
                        name: obj1.name,
                        data: _.values(angular.copy(matchObj)).splice(1)
                    }

                });

            },

            getChartValues: function () {
                return this.dataToArray();
            },

            getData: function () {
                return this.data;
            },

            getCellValue: function (row, col) {
                return this.data[row][col];
            },

            getStartValue: function (row, col) {
                return this.gridValues[row][col].startValue;
            },

            isGreater: function(row, col) {
                return this.data[row][col] > this.gridValues[row][col].startValue;
            },

            isLower: function(row, col) {
                return this.data[row][col] < this.gridValues[row][col].startValue;
            },

            setOriginalValue: function (row, month, col) {
                this.data[row][month] = this.gridValues[row][month].startValue;
                this.recountPredictive(row, col);
            }

        };

        function createGridModel(gridData) {

            var obj = {};

            _.each(gridData, function(o, i) {
                obj[i] = {};
                _.each(_.keys(o), function(key) {
                    obj[i][key] = {};
                    obj[i][key].startValue = gridData[i][key];
                })
            });

            return obj;
        }

        function numberOfEmployees(data) {

            var numberOfEmployees = _.find(data, {name: ROW_NAMES.numberOfEmployees}),
                recruiting        = _.find(data, {name: ROW_NAMES.recruiting}),
                totalTurnover     = _.find(data, {name: ROW_NAMES.totalTurnover});

            for (var i = 0; i < 6; i++) {
                var m = countMonths(i);
                //TODO: remove after real recruiting data
                if (!recruiting[m.prevMonth]) {
                    recruiting[m.prevMonth] = 30 + i;
                }
                recruiting[m.currentMonth] = 30 + i;
                numberOfEmployees[m.currentMonth] = recruiting[m.currentMonth] + numberOfEmployees[m.prevMonth] - totalTurnover[m.prevMonth] * numberOfEmployees[m.prevMonth] / 100;
             }
        }

        function countPredictive(data) {

            var fields = [ROW_NAMES.avgSalary, ROW_NAMES.remoteEmployees, ROW_NAMES.hpInProfDev];

            _.each(fields, function (key) {

                var field = _.find(data, {name: key});
                for (var i = 0; i < 6; i++) {
                    var m = countMonths(i);
                    field[m.currentMonth] = field[m.prevMonth] + (field[m.prevMonth] - field[m.halfYearAgoMonth]) / 6;
                }

            });

        }

        function nonHpTurnover(data) {

            var nonHpTurnover   = _.find(data, {name: ROW_NAMES.nonHpTurnover}),
                remoteEmployees = _.find(data, {name: ROW_NAMES.remoteEmployees}),
                avgSalary       = _.find(data, {name: ROW_NAMES.avgSalary});

            for (var i = 0; i < 6; i++) {
                var m = countMonths(i);
                nonHpTurnover[m.currentMonth] = (0.018 * avgSalary[m.prevMonth]) / ((remoteEmployees[m.currentMonth] / 100) * avgSalary[m.currentMonth]) * 100;
            }

        }

        function hpTurnover(data) {

            var remoteEmployees = _.find(data, {name: ROW_NAMES.remoteEmployees}),
                hpInProfDev     = _.find(data, {name: ROW_NAMES.hpInProfDev}),
                avgSalary       = _.find(data, {name: ROW_NAMES.avgSalary}),
                hpTurnover      = _.find(data, {name: ROW_NAMES.hpTurnover});

            for (var i = 0; i < 6; i++) {
                var m = countMonths(i);
                hpTurnover[m.currentMonth] = 100 * ((((1 - 0.5) * (1.55 - remoteEmployees[m.currentMonth] / 100)) / (remoteEmployees[m.currentMonth] / 100) / (((hpInProfDev[m.currentMonth] / 100) / (remoteEmployees[m.currentMonth] / 100)) * 95))) * avgSalary[m.prevMonth] / avgSalary[m.currentMonth];
            }

        }

        function totalTurnover(data) {

            var totalTurnover = _.find(data, {name: ROW_NAMES.totalTurnover}),
                nonHpTurnover = _.find(data, {name: ROW_NAMES.nonHpTurnover}),
                hpTurnover    = _.find(data, {name: ROW_NAMES.hpTurnover});

            for (var i = 0; i < 6; i++) {
                var m = countMonths(i);
                totalTurnover[m.currentMonth] = (nonHpTurnover[m.currentMonth] * 0.9) + (hpTurnover[m.currentMonth] * 0.1);
            }

        }

        function totalRecruitingCost(data) {

            var recruiting          = _.find(data, {name: ROW_NAMES.recruiting}),
                totalRecruitingCost = _.find(data, {name: ROW_NAMES.totalRecruitingCost});

            for (var i = 0; i < 6; i++) {
                var m = countMonths(i);
                totalRecruitingCost[m.currentMonth] = recruiting[m.currentMonth] * COST_PER_HIRE;
            }

        }

        function turnoverProductivityLoss(data) {

            var turnoverProductivityLoss = _.find(data, {name: ROW_NAMES.turnoverProductivityLoss}),
                numberOfEmployees        = _.find(data, {name: ROW_NAMES.numberOfEmployees}),
                totalTurnover            = _.find(data, {name: ROW_NAMES.totalTurnover}),
                avgSalary                = _.find(data, {name: ROW_NAMES.avgSalary});

            for (var i = 0; i < 6; i++) {
                var m = countMonths(i);
                turnoverProductivityLoss[m.currentMonth] = numberOfEmployees[m.currentMonth] * totalTurnover[m.currentMonth] * avgSalary[m.currentMonth] * 0.75;
            }

        }

        function companyRev(data) {

            var companyRev = _.find(data, {name: ROW_NAMES.companyRev});

            for (var i = 0; i < 6; i++) {
                var m = countMonths(i);
                companyRev[m.currentMonth] = companyRev[m.prevMonth] * 1.025;
            }

        }

        function turnoverProdLossOfRev(data) {

            var turnoverProductivityLoss = _.find(data, {name: ROW_NAMES.turnoverProductivityLoss}),
                turnoverProdLossOfRev    = _.find(data, {name: ROW_NAMES.turnoverProdLossOfRev}),
                companyRev               = _.find(data, {name: ROW_NAMES.companyRev});

            for (var i = 0; i < 6; i++) {
                var m = countMonths(i);
                turnoverProdLossOfRev[m.currentMonth] = turnoverProductivityLoss[m.currentMonth] / companyRev[m.currentMonth];
            }

        }

        function recountMonths (i) {
            return {
                currentMonth: moment().add(i, 'month').format('MMMM'),
                nextMonth: moment().add(i + 1, 'month').format('MMMM'),
                halfYearAgoMonth: moment().add(i + 1, 'month').subtract(6, 'month').format('MMMM')
            }
        }

        function countMonths (i) {
            return {
                currentMonth: moment().add(i, 'month').format('MMMM'),
                prevMonth: moment().add(i, 'month').subtract(1, 'month').format('MMMM'),
                halfYearAgoMonth: moment().add(i, 'month').subtract(6, 'month').format('MMMM')
            }
        }

        return Summary;

    }
})();