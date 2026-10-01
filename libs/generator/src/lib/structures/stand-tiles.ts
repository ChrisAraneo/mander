import type { Tile } from '@mander/model';
import { map, range } from 'lodash-es';
import type { Spot } from './types/spot';
import type { TilePatch } from './types/tile-patch';

export const standTiles = (
  spot: Spot,
  tile: Tile,
  height: number,
): TilePatch[] =>
  map(range(1, height + 1), (offset) => ({
    row: spot.row - offset,
    column: spot.column,
    tile,
  }));
