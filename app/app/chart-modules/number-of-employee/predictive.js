Promise.props({
    /**
     *
     */
    users: [],

    /**
     *
     */
    trendLine: 'POST' === req.method ? commonChartData.getTrendlineCurvePython(req.body) : [
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],
        [7, 0],
        [8, 0],
        [9, 0],
        [10, 0],
        [11, 0],
        [12, 0]
    ]
}).then(_resolve).catch(_reject);
