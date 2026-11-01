import { SPIRAL_CYCLE_ANGLE } from './consts';

export const computeWrappedAngle = (angle: number): number =>
  ((angle % SPIRAL_CYCLE_ANGLE) + SPIRAL_CYCLE_ANGLE) % SPIRAL_CYCLE_ANGLE;
