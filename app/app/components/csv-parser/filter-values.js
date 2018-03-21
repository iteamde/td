/**
 * @param csv
 * @param filters
 * @param ignoreFilters
 * @return {Promise}
 */
module.exports = function (csv, parser, ignoreFilters) {
    _.each(parser.header, function(header, index) {
        csv.header[index] = header;
    });

    if (ignoreFilters) {
        return Promise.resolve(csv);
    }

    return Promise.mapSeries(csv.data, function (row) {
        return Promise.mapSeries(row, function (value, index) {
            var headerValue = csv.header[index];
            return parser.filters[headerValue] ? parser.filters[headerValue](value) : value;
        });
    }).then(function (data) {
        return {
            header: csv.header,
            data: data
        };
    });
};
