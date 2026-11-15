import type { Level, Snowball } from '@mander/model';

export interface SnowballFlightPlan {
  snowballs: Snowball[];
  level: Level;
  tickSeconds: number;
}
