const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig([
    {
        files: ["**/*.ts"],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic,
            ...angular.configs.tsRecommended,
        ],
        processor: angular.processInlineTemplates,
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            "@angular-eslint/directive-selector": "off",
            "@angular-eslint/component-selector": "off",

            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
            "@typescript-eslint/no-inferrable-types": "off",
            "comma-dangle": ["error", "never"],
            "object-curly-spacing": ["error", "always"],
            "eol-last": ["error", "always"],
            "prefer-arrow-callback": "error",
            "func-style": ["error", "expression", { "allowArrowFunctions": true }],
            "arrow-body-style": ["error", "as-needed"],
            "@typescript-eslint/no-unsafe-function-type": "off",
            "@typescript-eslint/no-explicit-any": "off",

            "@angular-eslint/no-input-rename": "off"
        },
    },
    {
        files: ["**/*.html"],
        extends: [
            angular.configs.templateRecommended,
            angular.configs.templateAccessibility,
        ],
        rules: {
            "@angular-eslint/template/click-events-have-key-events": "off",
            "@angular-eslint/template/interactive-supports-focus": "off",
            "@angular-eslint/template/no-input-rename": "off"
        },
    }
]);
