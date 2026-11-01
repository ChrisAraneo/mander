import type { Tile } from '@mander/model';
import { map } from 'lodash-es';
import { toFrozenTile } from './internal/to-frozen-tile';

export const freezeBlocks = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (row) => map(row, toFrozenTile));
