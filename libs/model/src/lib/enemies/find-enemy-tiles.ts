import type { Point } from '../geometry/point';
import type { Level } from '../level/level';
import { findTiles } from '../tile/find-tiles';
import { TILE_ENEMY } from './enemy-spawn';

export const findEnemyTiles = (level: Level): Point[] =>
  findTiles(level, TILE_ENEMY);
