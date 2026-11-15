import type { Enemy } from '@mander/model';

export const isEnemyShooter = (enemy: Enemy): boolean =>
  enemy.kind === 'SHOOTER';
