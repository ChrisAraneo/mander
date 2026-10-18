import type { Fireball } from '@mander/model';
import { toSpinDirection } from './internal/to-spin-direction';

const QUARTER_TURN = Math.PI / 2;

export const getFireballHeading = (fireball: Fireball): number =>
  fireball.angle + toSpinDirection(fireball.spin) * QUARTER_TURN;
