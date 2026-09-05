import { chain, type Point } from '@mander/utils';
import { indexOf } from 'lodash-es';
import type { Level } from '../level/level';
import type { Tile } from './tile';

// The width bound is checked on the hit rather than by slicing each row: this
// runs three times per tick per replay, and copying every row cost ~270us of a
// ~720us tick with ghosts on screen.
export const findTile = (level: Level, tile: Tile): Point | null =>
  chain(level.tiles)
    .take(level.height)
    .map((row, y) => ({ x: indexOf(row, tile), y }))
    .find(({ x }) => x >= 0 && x < level.width)
    .thru((point) => point ?? null)
    .value();
