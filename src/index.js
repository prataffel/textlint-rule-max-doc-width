// LICENSE : MIT
"use strict";
const ObjectAssign = require("object-assign");
const defaultOptions = {
    max_width: 120
};


function split_text(string, length){
    var rest = string;
    // get the number of leading spaces
    var leading_spaces = 0
    while (rest.indexOf(" ") == 0) {
        leading_spaces += 1;
        rest = rest.substring(1, rest.length);
    }
    var length = length - leading_spaces;
    var splitted_text = " ".repeat(leading_spaces);
    // list of characters that are searched for linebreaks.
    const breaking_symbols = [": ", ". ", "! ", "? "];
    while (rest.length > length) {
        var line = rest.substring(0, length);
        var breaking_points = breaking_symbols.map(x => line.lastIndexOf(x));
        var split_pos = Math.max(...breaking_points);
        // If no symbol was found, split at the last space
        if (split_pos == -1) {
            split_pos = line.lastIndexOf(" ") - 1
        }
        splitted_text += line.substring(0, split_pos + 1)
        splitted_text += "\n" + " ".repeat(leading_spaces);
        
        rest = rest.substring(split_pos + 2, rest.length)
    }
    splitted_text += rest;

    // if (splitted_text.slice(-1) == " "){
    //     splitted_text += "\n";
    // }
    // if (breaking_symbols.map(x => x.substring(0, 1)).indexOf(splitted_text.slice(-1)) > -1 ){
    //     splitted_text += "\n";
    // }
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
            var total_len = 0
            for (const key in text) {
                if (splitted.hasOwnProperty(key)) {
                    const elem = splitted[key];
                    const len = elem.length;
                    // console.log(text.search(elem))
                    // console.log(total_len)

                    if (len > max) {
                        var replacementstring = split_text(elem, max);
                        const replace = fixer.replaceTextRange([total_len, total_len + len], replacementstring);
                        report(
                            node, new RuleError(
                                `Line is too long(now width: ${len}).`, {
                                    line: parseInt(key),
                                    column: max,
                                    fix: replace,
                                }
                            )
                        );
                        var no_of_newlines = replacementstring.match(RegExp("\\n", "g")).length
                        // console.log(no_of_newlines);
                        // total_len += replacementstring.length + 1;
                        total_len += len + 1;
                        console.log(replacementstring.length)
                        console.log(len)
                        // if (replacementstring.slice(-1) == "\n"){
                        //     total_len += -1;
                        // }
                    } else {
                        total_len += elem.length + 1;
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
