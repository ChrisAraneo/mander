import type { Point } from '@mander/utils';
import type { Level } from '../level/level';
import { TILE_ENEMY } from './enemy';
import { findTiles } from '../tile/find-tiles';

export const findEnemyTiles = (level: Level): Point[] =>
  findTiles(level, TILE_ENEMY);
