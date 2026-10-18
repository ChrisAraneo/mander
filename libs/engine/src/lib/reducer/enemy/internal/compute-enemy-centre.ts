import type { Enemy, Point } from '@mander/model';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';

export const computeEnemyCentre = (enemy: Enemy): Point => ({
  x: enemy.position.x + ENEMY_WIDTH / 2,
  y: enemy.position.y + ENEMY_HEIGHT / 2,
});
