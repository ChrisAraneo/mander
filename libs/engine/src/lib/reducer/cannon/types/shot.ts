import type { Cannon, Cannonball } from '@mander/model';

export interface Shot {
  cannon: Cannon;
  cannonball: Cannonball | null;
}
