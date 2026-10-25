import type { Layers } from '@mander/model';
import type { Pool } from './pool';

export interface StructureEntry {
  name: string;
  pool: Pool;
  sketch: Layers;
}
