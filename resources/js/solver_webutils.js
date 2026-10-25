function HTMLescape(str) {
    return str.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
}

function useBetterSymbols(str) {
    return str.replace(/\*/g, "&times;").replace(/-/g, "&minus;");
}

function discardContents(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function queryStringToDict(queryString) {
    let dict = {};
    if (queryString == null || queryString.length == 0) {
        return dict;
    }

    if (queryString[0] == '?') {
        queryString = queryString.substring(1);
    }

    let components = queryString.split("&");
    for (let i = 0; i < components.length; ++i) {
        let nameEqualsValue = components[i];
        let equalsPos = nameEqualsValue.search("=");

        if (equalsPos >= 0) {
            name = nameEqualsValue.substring(0, equalsPos);
            value = nameEqualsValue.substring(equalsPos + 1);
        }
        else {
            name = nameEqualsValue;
            value = "";
        }

        name = decodeURIComponent(name.replace(/\+/g, " "));
        value = decodeURIComponent(value.replace(/\+/g, " "));
        dict[name] = value;
    }

    return dict;
}

let hsv_sextant_starts = [ 0, 1, 2, 2, 1, 0 ];
let hsv_sextant_deltas = [ 1, -1, 1, -1, 1, -1 ];
function hsv_to_rgb(hue, saturation, value) {
    /* hue: 0-360
     * saturation: 0.0-1.0
     * value: 0.0-1.0
     *
     * Uses algorithm shamelessly nicked from Wikipedia.
     */
    let chroma = value * saturation;
    let sextant = Math.floor(hue / 60) % 6;
    let x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));

    let a = [ chroma, x, 0 ];
    let rgb = [0, 0, 0];

    let index = hsv_sextant_starts[sextant];
    let delta = hsv_sextant_deltas[sextant];
    for (let i = 0; i < 3; ++i) {
        rgb[i] = a[index];
        index = (index + 3 + delta) % 3;
    }

    let m = value - chroma;
    for (let i = 0; i < 3; ++i) {
        rgb[i] += m;
        rgb[i] = Math.floor(rgb[i] * 256);
        if (rgb[i] == 256)
            rgb[i] = 255;
    }

    return rgb;
}

function rgb_to_string(rgb) {
    let rgb_str = "#";
    for (let i = 0; i < 3; ++i) {
        if (rgb[i] < 16)
            rgb_str += "0";
        rgb_str += rgb[i].toString(16);
    }
    return rgb_str;
}

/* Background colour of a cell depends on the number of solutions.
 * 0 solutions: grey on lighter grey.
 * 1 solution: white background, black text (or grey if !saturate).
 * 2 or more solutions: hue component of background HSV colour is
 *     given by: min(sqrt(numsols - 2), 10) * 270 / 10. Lower counts of
 *     solutions are towards 0 degrees (red), higher counts of solutions are
 *     towards 270 degrees (blue-purple).
 *     Text is black, or grey if !saturate.
 */

/* Constants to work out approximate "brightness" of an RGB colour, taken from
 * https://www.w3.org/TR/AERT/#color-contrast */
const brightnessCoeffs = [0.299, 0.587, 0.114]
function solutionCountToFGBG(solutionCount, saturate) {
    let darkText = (saturate ? "#000000" : "#333333");
    let lightText = (saturate ? "#ffffff" : "#cccccc");
    if (solutionCount == 0) {
        return [ "#888888", "#dddddd" ];
    }
    else if (solutionCount == 1) {
        return [ darkText, "#ffffff" ];
    }
    else {
        let hue = Math.min(Math.sqrt(solutionCount - 2), 10) * 27.0;
        let rgb = hsv_to_rgb(hue, saturate ? 0.4 : 0.2, 1);
        let roughBrightness = 0;
        for (let i = 0; i < 3; ++i) {
            roughBrightness += brightnessCoeffs[i] * rgb[i] / 255.0;
        }
        return [ (roughBrightness > 0.5 ? darkText : lightText),
                  rgb_to_string(rgb) ];
    }
}
