import { STRUCTURE_WIDTH } from '@mander/structures';
import { every, size } from 'lodash-es';

export const isCut = (grid: number[][], tall: number): boolean =>
  size(grid) === tall && every(grid, (row) => size(row) === STRUCTURE_WIDTH);
