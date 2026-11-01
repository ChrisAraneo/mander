import { TILE_ICEBALL } from '../blocks/tile-iceball';
import { findTiles } from '../tile/find-tiles';
import type { Level } from '../types/level';
import type { Point } from '../types/point';

export const findIceballTiles = (level: Level): Point[] =>
  findTiles(level, TILE_ICEBALL);
