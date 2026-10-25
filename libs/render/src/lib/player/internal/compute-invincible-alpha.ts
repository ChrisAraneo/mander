import { INVINCIBLE_MIN_ALPHA, INVINCIBLE_PULSES_PER_SECOND } from '../consts';

const OPAQUE = 1;

const FULL_TURN = Math.PI * 2;

export const computeInvincibleAlpha = (time: number): number =>
  INVINCIBLE_MIN_ALPHA +
  ((OPAQUE - INVINCIBLE_MIN_ALPHA) *
    (1 + Math.cos(time * INVINCIBLE_PULSES_PER_SECOND * FULL_TURN))) /
    2;
