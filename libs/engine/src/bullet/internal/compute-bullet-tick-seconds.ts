import { type Bullet, type Level, MAX_TICK_SECONDS } from '@mander/model';
import type { BulletFlightPlan } from './types/bullet-flight-plan';

export const computeBulletTickSeconds = ({
  bullets,
  level,
  elapsedSeconds,
}: {
  bullets: Bullet[];
  level: Level;
  elapsedSeconds: number;
}): BulletFlightPlan => ({
  bullets,
  level,
  tickSeconds: Math.min(elapsedSeconds, MAX_TICK_SECONDS),
});
