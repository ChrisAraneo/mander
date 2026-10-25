import type { Pool } from './pool';

export interface SavedStructure {
  name: string;
  pool: Pool;
  isCreated: boolean;
}
