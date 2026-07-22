// @ts-check
import { configBuilder } from '@chris.araneo/eslint-config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Shared TypeScript rules + ignores from the shareable config.
  ...configBuilder()
    .addTypeScriptConfig({
      sources: ['apps/**/*.ts', 'libs/**/*.ts'],
    })
    .addIgnored({
      ignored: ['dist/', 'reports/', 'node_modules/', '.nx/'],
    })
    .build(),

  // JavaScript recommended rules.
  js.configs.recommended,

  // Vue single-file components.
  ...vue.configs['flat/recommended'],

  // Parse <script> blocks in .vue files with the TypeScript parser.
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  // Shared language options: browser + node globals.
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Disable stylistic rules that conflict with Prettier — keep this last.
  prettier,
);
