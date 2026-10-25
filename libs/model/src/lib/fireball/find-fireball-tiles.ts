import { TILE_FIREBALL } from '../blocks/tile-fireball';
import { findTiles } from '../tile/find-tiles';
import type { Level } from '../types/level';
import type { Point } from '../types/point';

export const findFireballTiles = (level: Level): Point[] =>
  findTiles(level, TILE_FIREBALL);
