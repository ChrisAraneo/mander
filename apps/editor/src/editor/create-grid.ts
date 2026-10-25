import { map, range } from 'lodash-es';
import { getHeight } from './get-height';
import { createGridRow } from './internal/create-grid-row';
import type { Pool } from './types/pool';

export const createGrid = (pool: Pool = 'normal'): number[][] =>
  map(range(getHeight(pool)), (row) => createGridRow(pool, row));
