'use strict';

/**
 * @param {RegExp|String} regex
 * @param {String} haystack
 * @return {Array}
 */
module.exports = function (regex, haystack) {
    var globalRegex = new RegExp(regex, 'g');
    var nonGlobalRegex = new RegExp(regex);
    var nonGlobalMatch;
    var globalMatch = haystack.match(globalRegex);
    var matchArray = [];

    for (var i = 0; i < globalMatch.length; i += 1) {
        nonGlobalMatch = globalMatch[i].match(nonGlobalRegex);
        matchArray.push(nonGlobalMatch);
    }

    return matchArray;
};
