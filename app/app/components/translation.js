var translationsCache = {};
var TranslationModel = require('../models/orm-models').Translation;

setInterval(function() {
    translationsCache = {};
}, 60000);

/**
 * @param token
 * @param langId
 */
module.exports = function (token, langId) {
    var cacheToken = 'token_' + langId + '_' + token;

    if (undefined !== translationsCache[cacheToken]) {
        return Promise.resolve(translationsCache[cacheToken]);
    }

    return TranslationModel.findAll({
        where: {
            trendata_translation_token: token
        }
    }).reduce(function (accumulator, item) {
        if (1 == item.trendata_language_id) {
            accumulator.defaultLangTitle = item.trendata_translation_text;
        }

        if (langId == item.trendata_language_id) {
            accumulator.selectedLangTitle = item.trendata_translation_text;
        }

        return accumulator;
    }, {
        defaultLangTitle: null,
        selectedLangTitle: null
    }).then(function (data) {
        return translationsCache[cacheToken] = data.selectedLangTitle
            ? data.selectedLangTitle
            : (data.defaultLangTitle ? data.defaultLangTitle : null);
    });
};
