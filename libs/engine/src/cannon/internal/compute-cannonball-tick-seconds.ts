import { type Cannonball, type Level, MAX_TICK_SECONDS } from '@mander/model';
import type { CannonballFlightPlan } from './types/cannonball-flight-plan';

export const computeCannonballTickSeconds = ({
  cannonballs,
  level,
  deltaSeconds,
}: {
  cannonballs: Cannonball[];
  level: Level;
  deltaSeconds: number;
}): CannonballFlightPlan => ({
  cannonballs,
  level,
  tickSeconds: Math.min(deltaSeconds, MAX_TICK_SECONDS),
});
