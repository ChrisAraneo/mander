import { find, indexOf, map, take } from 'lodash-es';
import { pipe } from 'remeda';
import type { Level } from '../types/level';
import type { Point } from '../types/point';
import type { Tile } from '../types/tile';

export const findTile = (level: Level, tile: Tile): Point | null =>
  pipe(
    level.tiles,
    (rows) => take(rows, level.height),
    (rows) => map(rows, (row, tileY) => ({ x: indexOf(row, tile), y: tileY })),
    (points) => find(points, ({ x }) => x >= 0 && x < level.width),
    (point) => point ?? null,
  );
