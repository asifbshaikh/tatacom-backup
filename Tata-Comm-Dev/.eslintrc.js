module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
        "jest": true,
        "es6": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-a11y/strict",

    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }

    },
    "plugins": [
        "react",
        "react-hooks"
    ],
    "rules": {
        "react/prop-types": "off",
        "react-hooks/exhaustive-deps": "off",
        "react/react-in-jsx-scope": "off",
        "no-unused-vars": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/media-has-caption": "off",
        "jsx-a11y/no-onchange": "off",
        "jsx-a11y/label-has-associated-control": ["error", {
            "required": {
                "some": ["nesting", "id"]
            }
        }],
        "jsx-a11y/label-has-for": ["error", {
            "required": {
                "some": ["nesting", "id"]
            }
        }],
        "jsx-a11y/no-autofocus": [ 2, {
            "ignoreNonDOM": true
        }],
    },
    "settings": {
        "react": {
            "version": "detect",
        }
    }
}
