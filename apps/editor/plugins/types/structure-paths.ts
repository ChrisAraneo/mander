import type { Pool } from './pool.ts';

export interface StructurePaths {
  structures: Record<Pool, string>;
  library: string;
}
