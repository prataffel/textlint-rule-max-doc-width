# textlint-rule-max-doc-width



## Install

Install with [npm](https://www.npmjs.com/):

    npm install git+https://github.com/prataffel/textlint-rule-max-doc-width.git

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "max-doc-width": {
        "max_width": 79,
    }
}
```

Via CLI

```
textlint --rule max-doc-width README.md
```

### Build

Builds source codes for publish to the `lib` folder.
You can write ES2015+ source codes in `src/` folder.

    npm run build

### Tests

Run test code in `test` folder.
Test textlint rule by [textlint-tester](https://github.com/textlint/textlint-tester "textlint-tester").

    npm test

## License

MIT © 0Delta
