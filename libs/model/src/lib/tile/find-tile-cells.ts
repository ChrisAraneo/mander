import { filter, flatMap, map, take } from 'lodash-es';
import { pipe } from 'remeda';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import type { TileCell } from './types/tile-cell';

export const findTileCells = (
  level: Level,
  isMatch: (tile: Tile) => boolean,
): TileCell[] =>
  pipe(
    level.tiles,
    (rows) => take(rows, level.height),
    (rows) =>
      flatMap(rows, (row, tileY) =>
        pipe(
          row,
          (cells) => take(cells, level.width),
          (cells) =>
            map(cells, (cell, tileX): TileCell => ({
              x: tileX,
              y: tileY,
              tile: cell,
            })),
          (cells) => filter(cells, ({ tile }) => isMatch(tile)),
        ),
      ),
  );
