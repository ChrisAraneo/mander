import type { Tile } from '@mander/model';
import { map } from 'lodash-es';
import { toBloomedTile } from './internal/to-bloomed-tile';

export const patchBloomedBlocks = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (row) => map(row, toBloomedTile));
