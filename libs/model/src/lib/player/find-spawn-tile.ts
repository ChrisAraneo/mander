import type { Point } from '../geometry/point';
import type { Level } from '../level/level';
import { findTile } from '../tile/find-tile';
import { TILE_SPAWN } from './spawn';

export const findSpawnTile = (level: Level): Point | null =>
  findTile(level, TILE_SPAWN);
