import { type Level, TILE_AIR } from '@mander/model';
import type { Point } from '@mander/utils';
import { map } from 'lodash-es';

export const shatterSpikeTile = <L extends Level>(
  level: L,
  tile: Point,
): L => ({
  ...level,
  tiles: map(level.tiles, (row, y) =>
    y === tile.y
      ? map(row, (cell, x) => (x === tile.x ? TILE_AIR : cell))
      : row,
  ),
});
