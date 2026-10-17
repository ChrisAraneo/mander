import type { Cannon, Cannonball } from '@mander/model';

export interface CannonShot {
  cannon: Cannon;
  cannonball: Cannonball | undefined;
}
