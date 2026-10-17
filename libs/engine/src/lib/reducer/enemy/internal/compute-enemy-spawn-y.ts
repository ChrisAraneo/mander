import { TILE_SIZE } from '@mander/model';
import type { Point } from '@mander/utils';
import { ENEMY_HEIGHT } from '../consts';

export const computeEnemySpawnY = (spawn: Point): number =>
  (spawn.y + 1) * TILE_SIZE - ENEMY_HEIGHT;
