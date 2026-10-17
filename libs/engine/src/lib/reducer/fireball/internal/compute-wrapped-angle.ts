import { FULL_TURN } from './consts';

export const computeWrappedAngle = (angle: number): number =>
  ((angle % FULL_TURN) + FULL_TURN) % FULL_TURN;
