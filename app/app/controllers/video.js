var apiCallTrack = require('../components/api-call-track');
var VideoModel = require('../models/orm-models').Video;

module.exports = {
    /**
     * @param req
     * @param res
     */
    getVideo: function (req, res) {
        apiCallTrack(function (trackApi) {
            VideoModel.findOne({
                where: {
                    trendata_video_url: req.body.url
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
