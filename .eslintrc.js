'use strict';

module.exports = {
    "extends": "airbnb",
    "env": {
        "node": true,
        "es6": true,
    },
    "rules": {
        "comma-dangle": ["error", "always-multiline"],
        "indent": ["error", 4],
        "new-cap": 0,
        // Allow private identifiers
        "no-underscore-dangle": 0,
    }
};
