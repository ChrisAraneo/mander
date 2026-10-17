import { TILE_SIZE } from '@mander/model';
import type { Point } from '@mander/utils';
import { ENEMY_WIDTH } from '../consts';

export const computeEnemySpawnX = (spawn: Point): number =>
  spawn.x * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2;
