import type { Cannonball, Level } from '@mander/model';

export interface CannonballFlightPlan {
  cannonballs: Cannonball[];
  level: Level;
  tickSeconds: number;
}
