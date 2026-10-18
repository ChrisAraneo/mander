import { TILE_CANNON } from '../blocks/cannon';
import type { Point } from '../geometry/point';
import type { Level } from '../level/level';
import { findTiles } from '../tile/find-tiles';

export const findCannonTiles = (level: Level): Point[] =>
  findTiles(level, TILE_CANNON);
