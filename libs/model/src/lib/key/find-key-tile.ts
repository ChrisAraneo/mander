import type { Point } from '@mander/utils';
import { findTile } from '../tile/find-tile';
import type { Level } from '../level/level';
import { TILE_KEY } from './key';

export const findKeyTile = (level: Level): Point | null =>
  findTile(level, TILE_KEY);
