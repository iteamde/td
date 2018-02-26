var TagModel = require('../models/orm-models').Tag;
var apiCallTrack = require('../components/api-call-track');

module.exports = {
    /**
     * @param req
     * @param res
     */
    getAllTags: function (req, res) {
        apiCallTrack(function (trackApi) {
            TagModel.findAll({
                where: {
                    trendata_tag_status: '1'
                }
            }).then(function (rows) {
                trackApi(req);
                res.json(rows);
            }).catch(function (err) {
                trackApi(req, err);
                res.status(500).send(err.stack);
            });
        });
    }
};
