import type { Pool } from './pool.ts';

export interface SavedStructure {
  name: string;
  pool: Pool;
  isCreated: boolean;
}
