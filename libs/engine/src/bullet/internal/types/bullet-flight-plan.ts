import type { Bullet, Level } from '@mander/model';

export interface BulletFlightPlan {
  bullets: Bullet[];
  level: Level;
  tickSeconds: number;
}
