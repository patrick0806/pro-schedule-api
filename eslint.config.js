const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const importHelpers = require('eslint-plugin-import-helpers');

module.exports = [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname,
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
            'import-helpers': importHelpers,
            prettier: prettier,
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            'prettier/prettier': 'error',
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-var-requires': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '_',
                    caughtErrors: 'all',
                },
            ],
            'import-helpers/order-imports': [
                'warn',
                {
                    newlinesBetween: 'always',
                    groups: [
                        'module',
                        '/^@config/',
                        '/^@shared/',
                        '/^@modules/',
                        ['parent', 'sibling', 'index'],
                    ],
                    alphabetize: { order: 'asc', ignoreCase: true },
                },
            ],
        },
    },
    {
        ignores: ['.eslintrc.js', 'eslint.config.js'],
    },
];