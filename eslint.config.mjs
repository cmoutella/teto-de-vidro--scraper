import { fixupPluginRules, fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import _import from 'eslint-plugin-import'
import importHelpers from 'eslint-plugin-import-helpers'
import jestPlugin from 'eslint-plugin-jest'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

const patchedConfig = fixupConfigRules([
  {
    ignores: [
      '**/build/**',
      '**/dist/**',
      '**/out/**',
      '**/node_modules/**',
      '**/public/scripts/**',
      '.lintstagedrc.js',
      'changelog.config.cjs'
    ]
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: fixupPluginRules(_import),
      'unused-imports': unusedImports,
      'import-helpers': importHelpers
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        process: true
      },

      parser: tseslint.parser,
      ecmaVersion: 12,
      sourceType: 'module',

      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaFeatures: {
          jsx: true,
          tsx: true
        }
      }
    },

    files: ['**/*.js', '**/*.ts'],

    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          caughtErrorsIgnorePattern: '^_'
        }
      ],

      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',

          groups: [
            '/^react/',
            '/^@react/',
            'module',
            '/^@\\//',
            ['parent', 'sibling', 'index']
          ],

          alphabetize: {
            order: 'asc',
            ignoreCase: true
          }
        }
      ],
      'unused-imports/no-unused-imports': 'error',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports'
        }
      ],
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  },
  {
    // disable type-aware linting on JS files
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked
  },
  {
    // enable jest rules on test files
    files: ['test/**'],
    ...jestPlugin.configs['flat/recommended']
  }
])

const config = [
  ...patchedConfig,
  // Add more flat configs here
  { ignores: ['.next/*'] }
]

export default config
