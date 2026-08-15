import {
  FIREBALL_SIZE,
  fireballHeading,
  fireballPosition,
} from '@mander/engine';
import type { Fireball } from '@mander/model';

import type { CanvasStep } from '../canvas';
import { EMBER_FIREBALL } from './fireball-colors';
import { flameStep, flickerOf } from './flame-step';

const RADIUS = FIREBALL_SIZE / 2;

export const fireballStep = (fireball: Fireball, time: number): CanvasStep =>
  flameStep(
    fireballPosition(fireball),
    fireballHeading(fireball),
    RADIUS * flickerOf(fireball.angle, time),
    EMBER_FIREBALL,
  );
