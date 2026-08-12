import { resolve } from 'node:path';

import type { Difficulty } from './difficulty';

const LIBRARY_DIR = '../../libs/structures/src/lib';

export interface StructurePaths {
  structures: Record<Difficulty, string>;
  library: string;
}

export const structurePaths = (root: string): StructurePaths => ({
  structures: {
    normal: resolve(root, LIBRARY_DIR, 'normal.ts'),
    hard: resolve(root, LIBRARY_DIR, 'hard.ts'),
  },
  library: resolve(root, LIBRARY_DIR, 'library.ts'),
});
