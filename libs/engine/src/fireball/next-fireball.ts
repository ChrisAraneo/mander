import type { Fireball } from '@mander/model';
import { computeAngularSpeed } from './internal/compute-angular-speed';
import { computeWrappedAngle } from './internal/compute-wrapped-angle';
import { toSpinDirection } from './internal/to-spin-direction';

export const nextFireball = (
  fireball: Fireball,
  deltaSeconds: number,
): Fireball => ({
  ...fireball,
  angle: computeWrappedAngle(
    fireball.angle +
      toSpinDirection(fireball.spin) *
        computeAngularSpeed(fireball.kind) *
        deltaSeconds,
  ),
});
