import { pipe } from 'remeda';
import { computeWrappedAngle } from './compute-wrapped-angle';
import { SPIRAL_ARM_ANGLE } from './consts';

export const computeOrbitSpiral = (angle: number): number =>
  pipe(
    computeWrappedAngle(angle) / SPIRAL_ARM_ANGLE,
    (arms) => 1 - Math.abs(1 - arms),
  );
