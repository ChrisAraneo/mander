import type { Tile } from '@mander/model';
import { range, size } from 'lodash-es';

export const createColumnNumbers = (tiles: Tile[][]) => ({
  tiles,
  columns: range(size(tiles[0])),
});
