import { TILE_AIR } from '@mander/model';
import { every, flatten } from 'lodash-es';

export const isBlank = (grid: number[][]): boolean =>
  every(flatten(grid), (cell) => cell === TILE_AIR);
