import { chain, type Point } from '@mander/utils';
import { indexOf } from 'lodash-es';
import type { Level } from '../level/level';
import type { Tile } from './tile';

export const findTile = (level: Level, tile: Tile): Point | null =>
  chain(level.tiles)
    .take(level.height)
    .map((row, y) => ({ x: indexOf(row, tile), y }))
    .find(({ x }) => x >= 0 && x < level.width)
    .thru((point) => point ?? null)
    .value();
