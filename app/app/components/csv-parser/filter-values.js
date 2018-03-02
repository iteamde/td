/**
 * @param csv
 * @param filters
 * @param ignoreFilters
 * @return {Promise}
 */
module.exports = function (csv, filters, ignoreFilters) {
    if (ignoreFilters) {
        return Promise.resolve(csv);
    }

    return Promise.mapSeries(csv.data, function (row) {
        return Promise.mapSeries(row, function (value, index) {
            var headerValue = csv.header[index];
            return filters[headerValue] ? filters[headerValue](value) : value;
        });
    }).then(function (data) {
        return {
            header: csv.header,
            data: data
        };
    });
};
