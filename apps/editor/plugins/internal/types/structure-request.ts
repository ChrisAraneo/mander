import type { Pool } from '../../types/pool.ts';

export interface StructureRequest {
  name: string;
  pool: Pool;
  text: string;
}
