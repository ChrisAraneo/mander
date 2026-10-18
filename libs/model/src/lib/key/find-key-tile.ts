import type { Point } from '../geometry/point';
import type { Level } from '../level/level';
import { findTile } from '../tile/find-tile';
import { TILE_KEY } from './key';

export const findKeyTile = (level: Level): Point | null =>
  findTile(level, TILE_KEY);
