import type { Fireball } from '@mander/model';
import { computeWrappedAngle } from './compute-wrapped-angle';
import { GERM_HALF_CYCLE_ANGLE } from './consts';
import { toOppositeSpin } from './to-opposite-spin';

export const toCounterGerm = (germ: Fireball): Fireball => ({
  ...germ,
  spin: toOppositeSpin(germ.spin),
  angle: computeWrappedAngle(germ.angle + GERM_HALF_CYCLE_ANGLE),
});
