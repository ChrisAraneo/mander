import type { Structure } from '@mander/structures';
import { map } from 'lodash-es';

export const cloneGrid = (grid: Structure): Structure =>
  map(grid, (row) => [...row]);
