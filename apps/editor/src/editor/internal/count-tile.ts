import { filter, flatten, size } from 'lodash-es';

export const countTile = (grid: number[][], tile: number): number =>
  size(filter(flatten(grid), (cell) => cell === tile));
