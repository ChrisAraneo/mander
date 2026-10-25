import { filter, flatMap, map, take } from 'lodash-es';
import { pipe } from 'remeda';
import type { Level } from '../types/level';
import type { Point } from '../types/point';
import type { Tile } from '../types/tile';

export const findTiles = (level: Level, tile: Tile): Point[] =>
  pipe(
    level.tiles,
    (rows) => take(rows, level.height),
    (rows) =>
      flatMap(rows, (row, tileY) =>
        pipe(
          row,
          (cells) => take(cells, level.width),
          (cells) =>
            map(cells, (cell, tileX) => ({ cell, x: tileX, y: tileY })),
          (cells) => filter(cells, ({ cell }) => cell === tile),
          (cells) => map(cells, ({ x, y }): Point => ({ x, y })),
        ),
      ),
  );
