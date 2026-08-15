import {
  fireballHeading,
  FIREBALL_SIZE,
  playerFireballPosition,
} from '@mander/engine';
import type { Fireball } from '@mander/model';

import type { CanvasStep } from '../canvas';
import { WHITE_FIREBALL } from './fireball-colors';
import { flameStep, flickerOf } from './flame-step';

const RADIUS = FIREBALL_SIZE / 2;

export const playerFireballStep = (
  fireball: Fireball,
  time: number,
): CanvasStep =>
  flameStep(
    playerFireballPosition(fireball),
    fireballHeading(fireball),
    RADIUS * flickerOf(fireball.angle, time),
    WHITE_FIREBALL,
  );
