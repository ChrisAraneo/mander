import {
  BLOCK,
  SECTOR_WIDTH,
  type Structure,
  STRUCTURE_HEIGHT,
} from '@mander/generator';

import { airGrid } from './air-grid';

export const flatGrid = (): Structure => {
  const grid = airGrid();
  grid[STRUCTURE_HEIGHT - 1] = Array.from({ length: SECTOR_WIDTH }, (): number => BLOCK);
  return grid;
};
