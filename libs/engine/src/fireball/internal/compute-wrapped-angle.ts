import { PINKBALL_CYCLE_ANGLE } from '../consts';

export const computeWrappedAngle = (angle: number): number =>
  ((angle % PINKBALL_CYCLE_ANGLE) + PINKBALL_CYCLE_ANGLE) %
  PINKBALL_CYCLE_ANGLE;
