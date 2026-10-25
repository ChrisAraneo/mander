import { findTiles } from '../tile/find-tiles';
import type { Level } from '../types/level';
import type { Point } from '../types/point';
import { TILE_ENEMY } from './tile-enemy';

export const findEnemyTiles = (level: Level): Point[] =>
  findTiles(level, TILE_ENEMY);
