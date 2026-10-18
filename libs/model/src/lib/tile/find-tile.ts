import { indexOf } from 'lodash-es';
import { chain } from '../functions/chain';
import type { Point } from '../geometry/point';
import type { Level } from '../level/level';
import type { Tile } from './tile';

export const findTile = (level: Level, tile: Tile): Point | null =>
  chain(level.tiles)
    .take(level.height)
    .map((row, y) => ({ x: indexOf(row, tile), y }))
    .find(({ x }) => x >= 0 && x < level.width)
    .thru((point) => point ?? null)
    .value();
