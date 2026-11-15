import type { Enemy } from '@mander/model';

export const isEnemyBeartrap = (enemy: Enemy): boolean =>
  enemy.kind === 'BEARTRAP';
