import type { Enemy } from '@mander/model';

export const killEnemy = (enemy: Enemy): Enemy => ({
  ...enemy,
  velocity: {
    x: { ...enemy.velocity.x, current: 0 },
    y: enemy.velocity.y,
  },
  timers: { ...enemy.timers, death: 0 },
});
