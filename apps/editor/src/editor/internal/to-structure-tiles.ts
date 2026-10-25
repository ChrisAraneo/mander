import type { Tile } from '@mander/model';
import { map } from 'lodash-es';
import { toStructureTile } from './to-structure-tile';

export const toStructureTiles = (grid: number[][]): Tile[][] =>
  map(grid, (cells) => map(cells, toStructureTile));
