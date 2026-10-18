import type { Fireball } from '@mander/model';
import { FIREBALL_ANGULAR_SPEED } from './consts';
import { computeWrappedAngle } from './internal/compute-wrapped-angle';
import { toSpinDirection } from './internal/to-spin-direction';

export const stepFireball = (
  fireball: Fireball,
  deltaSeconds: number,
): Fireball => ({
  ...fireball,
  angle: computeWrappedAngle(
    fireball.angle +
      toSpinDirection(fireball.spin) * FIREBALL_ANGULAR_SPEED * deltaSeconds,
  ),
});
