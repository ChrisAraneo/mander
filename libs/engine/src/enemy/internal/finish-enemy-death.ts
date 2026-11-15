import type { Enemy } from '@mander/model';
import { ENEMY_DEATH_SECONDS } from '../consts';

export const finishEnemyDeath = (enemy: Enemy): Enemy => ({
  ...enemy,
  velocity: {
    x: { ...enemy.velocity.x, current: 0 },
    y: { ...enemy.velocity.y, current: 0 },
  },
  timers: { ...enemy.timers, death: ENEMY_DEATH_SECONDS },
});
