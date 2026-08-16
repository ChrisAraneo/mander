import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import { structureLibrary } from './plugins/structure-library.ts';

const LIBRARY_FILES = [
  '**/libs/structures/src/lib/normal.ts',
  '**/libs/structures/src/lib/hard.ts',
  '**/libs/structures/src/lib/library.ts',
];

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
