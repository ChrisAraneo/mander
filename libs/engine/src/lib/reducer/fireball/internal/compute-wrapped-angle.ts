import { GERM_CYCLE_ANGLE } from './consts';

export const computeWrappedAngle = (angle: number): number =>
  ((angle % GERM_CYCLE_ANGLE) + GERM_CYCLE_ANGLE) % GERM_CYCLE_ANGLE;
