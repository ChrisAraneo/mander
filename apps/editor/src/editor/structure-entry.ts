import type { Layers } from '@mander/model';

export type Pool = 'normal' | 'hard' | 'vertical';

export interface StructureEntry {
  name: string;
  pool: Pool;
  sketch: Layers;
}
