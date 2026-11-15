import { map } from 'lodash-es';
import { patchSnowballPosition } from './patch-snowball-position';
import type { SnowballFlight } from './types/snowball-flight';
import type { SnowballFlightPlan } from './types/snowball-flight-plan';

export const patchSnowballFlight = ({
  snowballs,
  level,
  tickSeconds,
}: SnowballFlightPlan): SnowballFlight => ({
  snowballs: map(snowballs, (snowball) =>
    patchSnowballPosition(snowball, tickSeconds),
  ),
  level,
});
