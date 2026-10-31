import type { Enemy } from '@mander/model';

export const isEnemyFreezing = (enemy: Enemy): boolean =>
  enemy.kind === 'FREEZING';
