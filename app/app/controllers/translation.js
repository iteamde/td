var TranslationModel = require('../models/orm-models').Translation;
var LanguageModel = require('../models/orm-models').Language;
var apiCallTrack = require('../components/api-call-track');

module.exports = {
    /**
     * @param req
     * @param res
     */
    getTranslations: function (req, res) {
        apiCallTrack(function (trackApi) {
            var lngId = parseInt(req.params.lngId || 1);

            Promise.resolve().then(function () {
                return Promise.props({
                    main: TranslationModel.findAll({
                        include: [
                            {
                                model: LanguageModel,
                                required: true,
                                where: {
                                    trendata_language_id: lngId
                                }
                            }
                        ]
                    }),
                    en: 1 == lngId ? [] : TranslationModel.findAll({
                        include: [
                            {
                                model: LanguageModel,
                                required: true,
                                where: {
                                    trendata_language_id: 1
                                }
                            }
                        ]
                    })
                });
            }).then(function (data) {
                return Promise.props({
                    main: Promise.reduce(data.main, function (result, item) {
                        result[item.trendata_translation_token] = item.trendata_translation_text;
                        return result;
                    }, {}),
                    en: Promise.reduce(data.en, function (result, item) {
                        result[item.trendata_translation_token] = item.trendata_translation_text;
                        return result;
                    }, {})
                });
            }).then(function (data) {
                trackApi(req);
                res.json(_.merge(data.en, data.main));
            }).catch(function (err) {
                trackApi(req, err);
                res.status(500).send(err.stack);
            });
        });
    }
};
