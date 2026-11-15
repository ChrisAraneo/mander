import { map } from 'lodash-es';
import { patchBulletPosition } from './patch-bullet-position';
import type { BulletFlight } from './types/bullet-flight';
import type { BulletFlightPlan } from './types/bullet-flight-plan';

export const patchBulletFlight = ({
  bullets,
  level,
  tickSeconds,
}: BulletFlightPlan): BulletFlight => ({
  bullets: map(bullets, (bullet) => patchBulletPosition(bullet, tickSeconds)),
  level,
});
