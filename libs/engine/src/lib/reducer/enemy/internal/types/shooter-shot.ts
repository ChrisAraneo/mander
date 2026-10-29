import type { Cannonball, Enemy } from '@mander/model';

export interface ShooterShot {
  enemy: Enemy;
  cannonball: Cannonball | undefined;
}
