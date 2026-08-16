import { chain, type Point } from '@mander/utils';
import { indexOf, take } from 'lodash-es';
import type { Level } from '../level/level';
import type { Tile } from './tile';

export const findTile = (level: Level, tile: Tile): Point | null =>
  chain(level.tiles)
    .take(level.height)
    .map((row, y) => ({ x: indexOf(take(row, level.width), tile), y }))
    .find(({ x }) => x >= 0)
    .thru((point) => point ?? null)
    .value();
