// @ts-check
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import { configBuilder } from '@chris.araneo/eslint-config';

export default [
  ...configBuilder()
    .addTypeScriptConfig({
      sources: ['^(apps|libs)/(?!.*\\.spec\\.ts$).*\\.ts$'],
    })
    .addTypeScriptTestsConfig({
      sources: ['^(apps|libs)/.*\\.spec\\.ts$'],
    })
    .addIgnored({
      ignored: ['dist/', 'reports/', 'node_modules/', '.nx/'],
    })
    .build(),
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
];
