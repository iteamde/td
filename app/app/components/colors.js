'use strict';

// let randomColor = require('randomcolor');
// let colors = '#B44848, #CC8454, #FDD9B5, #F0E891, #87A96B, #CDA4DE, #808080, #FFAACC, #1CD3A2, #000000, #734F96, #0066FF, #FFBF00, #FF1493, #CCFF00, #FFCC00, #B5651D, #7CFC00, #DA3163, #FF8243, #800000, #CC00FF, #FF4800, #57D200, #FF9900, #FF0000, #FF8000, #FFFF00, #008000, #00CCFF, #0000FF, #800080, #803300';
let colors = '#404e5a, #ed0a3f, #00b9fb, #87ff2a, #ff99cc, #a36f40, #bb3385, #0a6b0d, #ffdf00, #03bb85, #c5e17a, #8359a3, #87421f, #d0ff14, #e90067, #ff861f, #01a368, #af593e, #0066ff, #000000, #a78b00, #788193, #1164b4, #f4fa9f, #514e49, #fed8b1, #c32148, #01796f, #ff91a4, #6cdae7, #ffc1cc, #006a93, #e2b631, #6eeb6e, #bc6cac, #b99685, #ffae42, #8fd8d8, #ca3435, #f6bef1, #b5a895, #03228e, #e6335f, #497e48, #b2592d, #708eb3, #5e4330, #fd7c6e, #6456b7, #926f5b, #6f9940, #ff3f34, #fdff00, #4f69c6, #ff7a00, #63b76c, #fc74fd, #d9d6cf, #00755e';
let arrayColors = [];

module.exports = {
    // generate: generate,
    getAll: getAll,
};

// function generate() {
//     let arrayColors = randomColor({
//         count: 100,
//         hue: 'random',
//     });

//     colors = arrayColors.join(', ');
// }

function getAll(count) {
    return colors;

    // if (count && typeof count == Number && count > 0) {
    //     return arrayColors.slice(0, count).join(', ');
    // } else {
    //     return colors;
    // }
}