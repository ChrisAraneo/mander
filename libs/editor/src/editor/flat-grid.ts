import {
  BLOCK,
  SECTOR_WIDTH,
  type Structure,
  STRUCTURE_HEIGHT,
} from '@mander/generator';
import { fill } from 'lodash-es';

import { airGrid } from './air-grid';

export function flatGrid(): Structure {
  const grid = airGrid();
  grid[STRUCTURE_HEIGHT - 1] = fill(new Array(SECTOR_WIDTH), BLOCK);
  return grid;
}
