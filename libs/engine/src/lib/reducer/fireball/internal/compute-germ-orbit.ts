import { pipe } from 'remeda';
import { PINKBALL_LOOP_RADIUS } from '../consts';
import { computeWrappedAngle } from './compute-wrapped-angle';
import { FULL_TURN, GERM_LOOP_ANGLE, QUARTER_TURN } from './consts';
import type { FireballOrbit } from './types/fireball-orbit';

export const computeGermOrbit = (angle: number): FireballOrbit =>
  pipe(
    computeWrappedAngle(angle),
    (wrapped) => ({
      loop: Math.floor(wrapped / FULL_TURN),
      turn: wrapped % FULL_TURN,
    }),
    ({ loop, turn }) => ({
      radius: 2 * PINKBALL_LOOP_RADIUS * Math.sin(turn / 2),
      angle: loop * GERM_LOOP_ANGLE + turn / 2 - QUARTER_TURN,
    }),
  );
