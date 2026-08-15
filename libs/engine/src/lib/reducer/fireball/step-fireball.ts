import type { Fireball } from '@mander/model';

import { FIREBALL_ANGULAR_SPEED } from './consts';
import { spinDirection } from './spin-direction';

const FULL_TURN = Math.PI * 2;

const wrapped = (angle: number): number =>
  ((angle % FULL_TURN) + FULL_TURN) % FULL_TURN;

export const stepFireball = (
  fireball: Fireball,
  deltaSeconds: number,
): Fireball => ({
  ...fireball,
  angle: wrapped(
    fireball.angle +
      spinDirection(fireball.spin) * FIREBALL_ANGULAR_SPEED * deltaSeconds,
  ),
});
