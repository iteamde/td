'use strict';

const { findBestMatch } = require('../similar-text/index');

class TextClassifier {
    /**
     *
     */
    constructor() {
        this._data = {};
    }

    /**
     * @param text
     * @param textClass
     * @returns {TextClassifier}
     */
    train(text, textClass) {
        if (!this._data[textClass]) {
            this._data[textClass] = [];
        }

        this._data[textClass].push(text);
        return this;
    }

    /**
     * @param {Object} data
     * @returns {TextClassifier}
     */
    trainBatch(data) {
        for (let text in data) {
            this.train(text, data[text]);
        }

        return this;
    }

    /**
     * @param {string} text
     * @returns {{score: number, textClass: text}}
     */
    classify(text) {
        let textClass = null;
        let score = null;
        let bestMatch;

        for (let _textClass in this._data) {
            bestMatch = findBestMatch(text, this._data[_textClass]);

            if (bestMatch.bestMatch.rating > score) {
                score = bestMatch.bestMatch.rating;
                textClass = _textClass;
            }
        }

        return {
            score,
            textClass
        };
    }
}

module.exports = TextClassifier;
