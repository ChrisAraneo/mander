import { map } from 'lodash-es';
import { pipe } from 'remeda';
import type { Level } from '../types/level';
import type { Point } from '../types/point';
import type { Tile } from '../types/tile';
import { findTileCells } from './find-tile-cells';

export const findTiles = (level: Level, tile: Tile): Point[] =>
  pipe(
    findTileCells(level, (cell) => cell === tile),
    (cells) => map(cells, ({ x, y }): Point => ({ x, y })),
  );
