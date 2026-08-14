import type { Fireball } from '@mander/model';

import { FIREBALL_ANGULAR_SPEED } from './consts';

const FULL_TURN = Math.PI * 2;

export const stepFireball = (
  fireball: Fireball,
  deltaSeconds: number,
): Fireball => ({
  ...fireball,
  angle: (fireball.angle + FIREBALL_ANGULAR_SPEED * deltaSeconds) % FULL_TURN,
});
