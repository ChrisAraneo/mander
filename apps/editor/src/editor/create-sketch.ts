import type { Layers } from '@mander/model';
import { createEmptyGrid } from './create-empty-grid';
import { createGrid } from './create-grid';
import type { Pool } from './types/pool';

export const createSketch = (pool: Pool = 'normal'): Layers => ({
  tiles: createGrid(pool),
  backTiles: createEmptyGrid(pool),
});
