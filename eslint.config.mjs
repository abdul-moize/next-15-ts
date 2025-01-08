import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import typescriptSortKeys from 'eslint-plugin-typescript-sort-keys';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import globals from 'globals';
import js from '@eslint/js';
import eslintNextPlugin from '@next/eslint-plugin-next';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  ...compat.extends(
    'airbnb',
    'next/core-web-vitals',
    'next/typescript',
    'eslint:recommended'
  ),
  {
    ignores: [
      '.lintstagedrc.js',
      'eslint.config.mjs',
    ],
  },
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
      'typescript-sort-keys': typescriptSortKeys,
      'sort-keys-fix': sortKeysFix,
      'next': eslintNextPlugin
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 5,
      sourceType: 'commonjs',

      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: '.',
      },
    },

    rules: {
      'import/prefer-default-export': 'off',
      'react/function-component-definition': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/extensions': 'off',

      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.tsx'],
        },
      ],

      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
        },
      ],

      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',

      'max-len': [
        'error',
        {
          code: 130,
          ignoreUrls: true,
        },
      ],

      '@typescript-eslint/no-explicit-any': 'off',
      'no-await-in-loop': 'off',

      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['state'],
        },
      ],
    },
  },
  {
    files: ['*/.js', '*/.jsx', '*/.ts', '*/.tsx'],

    rules: {
      'typescript-sort-keys/interface': 'error',
      'typescript-sort-keys/string-enum': 'error',
      'sort-keys-fix/sort-keys-fix': 'error',
      'unused-imports/no-unused-imports': 'error',
    },
  },
];

export default eslintConfig;
