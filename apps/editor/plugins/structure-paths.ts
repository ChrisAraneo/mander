import { resolve } from 'node:path';

import type { Pool } from './pool.ts';

const LIBRARY_DIR = '../../libs/structures/src/lib';

export interface StructurePaths {
  structures: Record<Pool, string>;
  library: string;
}

export const structurePaths = (root: string): StructurePaths => ({
  structures: {
    normal: resolve(root, LIBRARY_DIR, 'normal.ts'),
    hard: resolve(root, LIBRARY_DIR, 'hard.ts'),
    vertical: resolve(root, LIBRARY_DIR, 'vertical.ts'),
  },
  library: resolve(root, LIBRARY_DIR, 'library.ts'),
});
