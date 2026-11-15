import { map } from 'lodash-es';
import { patchCannonballPosition } from './patch-cannonball-position';
import type { CannonballFlight } from './types/cannonball-flight';
import type { CannonballFlightPlan } from './types/cannonball-flight-plan';

export const patchCannonballFlight = ({
  cannonballs,
  level,
  tickSeconds,
}: CannonballFlightPlan): CannonballFlight => ({
  cannonballs: map(cannonballs, (cannonball) =>
    patchCannonballPosition(cannonball, tickSeconds),
  ),
  level,
});
