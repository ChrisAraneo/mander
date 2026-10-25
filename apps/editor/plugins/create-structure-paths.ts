import { resolve } from 'node:path';
import type { StructurePaths } from './types/structure-paths.ts';

const LIBRARY_DIR = '../../libs/structures/src/lib';

export const createStructurePaths = (root: string): StructurePaths => ({
  structures: {
    normal: resolve(root, LIBRARY_DIR, 'normal.ts'),
    hard: resolve(root, LIBRARY_DIR, 'hard.ts'),
    vertical: resolve(root, LIBRARY_DIR, 'vertical.ts'),
  },
  library: resolve(root, LIBRARY_DIR, 'library.ts'),
});
