import { TILE_FIREBALL } from '../blocks/fireball';
import type { Point } from '../geometry/point';
import type { Level } from '../level/level';
import { findTiles } from '../tile/find-tiles';

export const findFireballTiles = (level: Level): Point[] =>
  findTiles(level, TILE_FIREBALL);
