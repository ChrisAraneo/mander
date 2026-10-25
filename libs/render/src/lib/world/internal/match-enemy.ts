import type { Enemy } from '@mander/model';

export const matchEnemy = (one: Enemy, other: Enemy): boolean =>
  one.spawn.x === other.spawn.x && one.spawn.y === other.spawn.y;
