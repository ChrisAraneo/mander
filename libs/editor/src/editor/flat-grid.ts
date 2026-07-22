import { fill } from 'lodash-es';
import { BLOCK, SECTOR_WIDTH, STRUCTURE_HEIGHT, type Structure } from '@mander/generator';
import { airGrid } from './air-grid';

export function flatGrid(): Structure {
  const grid = airGrid();
  grid[STRUCTURE_HEIGHT - 1] = fill(new Array(SECTOR_WIDTH), BLOCK);
  return grid;
}
