// LICENSE : MIT
"use strict";
const ObjectAssign = require("object-assign");
const defaultOptions = {
    max_width: 120
};
String.prototype.bytes = function () {
    var length = 0;
    for (var i = 0; i < this.length; i++) {
        var c = this.charCodeAt(i);
        if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
            length += 1;
        } else {
            length += 2;
        }
    }
    return length;
};


function split_text(string, length){
    var splitted_text = ""
    var rest = string;
    // list of characters that are searched for linebreaks.
    const breaking_symbols = [": ", ". ", "! ", "? "];
    while (rest.bytes() > length) {
        var line = rest.substring(0, length);
        var breaking_points = breaking_symbols.map(x => line.lastIndexOf(x));
        var split_pos = Math.max(...breaking_points);
        // If no symbol was found, split at the last space
        if (split_pos == -1) {
            split_pos = line.lastIndexOf(" ") -1
        }
        splitted_text += line.substring(0, split_pos + 1)
        splitted_text += "\n"
        
        rest = rest.substring(split_pos + 2, rest.bytes())
    }
    splitted_text += rest;
    return splitted_text;
}

const reporter = (context, options = defaultOptions) => {
    options = ObjectAssign({}, defaultOptions, options);
    const {
        Syntax,
        RuleError,
        fixer,
        report,
        getSource
    } = context;
    const max = options.max_width;
    return {
        [Syntax.Document](node) {
            const text = getSource(node);
            const splitted = text.split("\n");
            for (const key in text) {
                if (splitted.hasOwnProperty(key)) {
                    const elem = splitted[key];
                    const len = elem.bytes();

                    if (len > max) {
                        var index = text.search(elem)
                        var replacementstring = split_text(elem, max)
                        const replace = fixer.replaceTextRange([index, index + len], replacementstring);
                        report(
                            node, new RuleError(
                                `Line is too long(now width: ${len}).`, {
                                    line: parseInt(key),
                                    column: max,
                                    fix: replace,
                                }
                            )
                        );
                    }
                }
            }
        }
    }
};

module.exports = {
    linter: reporter,
    // This rule has fixer.
    fixer: reporter
};
