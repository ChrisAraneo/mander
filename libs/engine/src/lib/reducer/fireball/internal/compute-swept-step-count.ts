import { ceil } from 'lodash-es';
import {
  PLAYER_FIREBALL_ORBIT_RADIUS,
  PLAYER_FIREBALL_SWEEP_STEP,
} from '../consts';

export const computeSweptStepCount = (sweptAngle: number): number =>
  Math.max(
    1,
    ceil(
      (sweptAngle * PLAYER_FIREBALL_ORBIT_RADIUS) / PLAYER_FIREBALL_SWEEP_STEP,
    ),
  );
