import type { Fireball } from '@mander/model';
import { PINKBALL_HALF_CYCLE_ANGLE } from '../consts';
import { computeWrappedAngle } from './compute-wrapped-angle';
import { toOppositeSpin } from './to-opposite-spin';

export const toCounterPinkball = (pinkball: Fireball): Fireball => ({
  ...pinkball,
  spin: toOppositeSpin(pinkball.spin),
  angle: computeWrappedAngle(pinkball.angle + PINKBALL_HALF_CYCLE_ANGLE),
});
