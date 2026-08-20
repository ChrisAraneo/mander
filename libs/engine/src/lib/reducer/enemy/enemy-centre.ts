import type { Enemy } from '@mander/model';
import type { Point } from '@mander/utils';

import { ENEMY_HEIGHT, ENEMY_WIDTH } from './consts';

export const enemyCentre = (enemy: Enemy): Point => ({
  x: enemy.position.x + ENEMY_WIDTH / 2,
  y: enemy.position.y + ENEMY_HEIGHT / 2,
});
