import { TILE_AIR } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { map, range, times } from 'lodash-es';
import { getHeight } from './get-height';
import type { Pool } from './types/pool';

export const createEmptyGrid = (pool: Pool = 'normal'): number[][] =>
  map(range(getHeight(pool)), () => times(STRUCTURE_WIDTH, () => TILE_AIR));
