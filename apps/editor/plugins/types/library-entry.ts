import type { Pool } from './pool.ts';

export interface LibraryEntry {
  name: string;
  pool: Pool;
  text: string;
}
