import {
  getFireballHeading,
  FIREBALL_SIZE,
  getPlayerFireballPosition,
} from '@mander/engine';
import type { Fireball } from '@mander/model';

import type { CanvasStep } from '../canvas';
import { WHITE_FIREBALL } from './fireball-colors';
import { createFlameStep, getFlicker } from './create-flame-step';

const RADIUS = FIREBALL_SIZE / 2;

export const createPlayerFireballStep = (
  fireball: Fireball,
  time: number,
): CanvasStep =>
  createFlameStep(
    getPlayerFireballPosition(fireball),
    getFireballHeading(fireball),
    RADIUS * getFlicker(fireball.angle, time),
    WHITE_FIREBALL,
  );
