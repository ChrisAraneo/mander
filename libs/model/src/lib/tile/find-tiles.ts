import { chain, type Point } from '@mander/utils';
import type { Level } from '../level/level';
import type { Tile } from './tile';

export const findTiles = (level: Level, tile: Tile): Point[] =>
  chain(level.tiles)
    .take(level.height)
    .flatMap((row, y) =>
      chain(row)
        .take(level.width)
        .map((cell, x) => ({ cell, x, y }))
        .filter(({ cell }) => cell === tile)
        .map(({ x, y }): Point => ({ x, y }))
        .value(),
    )
    .value();
