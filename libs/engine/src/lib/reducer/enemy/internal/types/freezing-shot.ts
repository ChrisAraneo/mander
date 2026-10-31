import type { Enemy, Snowball } from '@mander/model';

export interface FreezingShot {
  enemy: Enemy;
  snowball: Snowball | undefined;
}
