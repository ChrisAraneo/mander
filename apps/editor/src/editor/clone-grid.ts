import type { Structure } from '@mander/generator';
import { map } from 'lodash-es';

export const cloneGrid = (grid: Structure): Structure =>
  map(grid, (row) => [...row]);
