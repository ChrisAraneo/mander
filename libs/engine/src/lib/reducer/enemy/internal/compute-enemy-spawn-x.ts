import { TILE_SIZE, type Point } from '@mander/model';
import { ENEMY_WIDTH } from '../consts';

export const computeEnemySpawnX = (spawn: Point): number =>
  spawn.x * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2;
