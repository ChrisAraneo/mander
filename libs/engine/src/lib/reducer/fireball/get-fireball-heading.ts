import type { Fireball } from '@mander/model';

import { getSpinDirection } from './get-spin-direction';

const QUARTER_TURN = Math.PI / 2;

export const getFireballHeading = (fireball: Fireball): number =>
  fireball.angle + getSpinDirection(fireball.spin) * QUARTER_TURN;
