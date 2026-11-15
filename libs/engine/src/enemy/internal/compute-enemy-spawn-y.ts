import { TILE_SIZE, type Point } from '@mander/model';
import { ENEMY_HEIGHT } from '../consts';

export const computeEnemySpawnY = (spawn: Point): number =>
  (spawn.y + 1) * TILE_SIZE - ENEMY_HEIGHT;
