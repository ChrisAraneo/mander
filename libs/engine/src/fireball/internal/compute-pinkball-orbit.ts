import { floor } from 'lodash-es';
import { pipe } from 'remeda';
import {
  FULL_TURN,
  PINKBALL_LOOP_ANGLE,
  PINKBALL_LOOP_RADIUS,
  QUARTER_TURN,
} from '../consts';
import { computeWrappedAngle } from './compute-wrapped-angle';
import type { FireballOrbit } from './types/fireball-orbit';

export const computePinkballOrbit = (angle: number): FireballOrbit =>
  pipe(
    computeWrappedAngle(angle),
    (wrapped) => ({
      loop: floor(wrapped / FULL_TURN),
      turn: wrapped % FULL_TURN,
    }),
    ({ loop, turn }) => ({
      radius: 2 * PINKBALL_LOOP_RADIUS * Math.sin(turn / 2),
      angle: loop * PINKBALL_LOOP_ANGLE + turn / 2 - QUARTER_TURN,
    }),
  );
