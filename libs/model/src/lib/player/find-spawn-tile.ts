import { findTile } from '../tile/find-tile';
import type { Level } from '../types/level';
import type { Point } from '../types/point';
import { TILE_SPAWN } from './tile-spawn';

export const findSpawnTile = (level: Level): Point | null =>
  findTile(level, TILE_SPAWN);
