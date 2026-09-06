import vue from '@vitejs/plugin-vue';
import { map } from 'lodash-es';
import { defineConfig } from 'vite';

import { POOLS } from './plugins/pool.ts';
import { structureLibrary } from './plugins/structure-library.ts';

const LIBRARY_DIR = '**/libs/structures/src/lib';

const LIBRARY_FILES = map(
  [...POOLS, 'library'],
  (file) => `${LIBRARY_DIR}/${file}.ts`,
);

export default defineConfig({
  plugins: [vue(), structureLibrary()],
  server: {
    port: 4201,
    watch: {
      ignored: LIBRARY_FILES,
    },
  },
  preview: {
    port: 4301,
  },
});
