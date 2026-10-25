import { map } from 'lodash-es';

export const cloneGrid = (grid: number[][]): number[][] =>
  map(grid, (row) => [...row]);
