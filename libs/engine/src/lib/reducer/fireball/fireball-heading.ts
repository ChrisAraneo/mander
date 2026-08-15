import type { Fireball } from '@mander/model';

import { spinDirection } from './spin-direction';

const QUARTER_TURN = Math.PI / 2;

export const fireballHeading = (fireball: Fireball): number =>
  fireball.angle + spinDirection(fireball.spin) * QUARTER_TURN;
