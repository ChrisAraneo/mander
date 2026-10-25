import { TILE_CANNON } from '../blocks/tile-cannon';
import { findTiles } from '../tile/find-tiles';
import type { Level } from '../types/level';
import type { Point } from '../types/point';

export const findCannonTiles = (level: Level): Point[] =>
  findTiles(level, TILE_CANNON);
