import { type Level, MAX_TICK_SECONDS, type Snowball } from '@mander/model';
import type { SnowballFlightPlan } from './types/snowball-flight-plan';

export const computeSnowballTickSeconds = ({
  snowballs,
  level,
  deltaSeconds,
}: {
  snowballs: Snowball[];
  level: Level;
  deltaSeconds: number;
}): SnowballFlightPlan => ({
  snowballs,
  level,
  tickSeconds: Math.min(deltaSeconds, MAX_TICK_SECONDS),
});
