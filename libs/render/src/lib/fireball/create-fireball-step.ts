import {
  FIREBALL_SIZE,
  getFireballHeading,
  getFireballPosition,
} from '@mander/engine';
import type { Fireball } from '@mander/model';

import type { CanvasStep } from '../canvas';
import { EMBER_FIREBALL } from './fireball-colors';
import { createFlameStep, getFlicker } from './create-flame-step';

const RADIUS = FIREBALL_SIZE / 2;

export const createFireballStep = (
  fireball: Fireball,
  time: number,
): CanvasStep =>
  createFlameStep(
    getFireballPosition(fireball),
    getFireballHeading(fireball),
    RADIUS * getFlicker(fireball.angle, time),
    EMBER_FIREBALL,
  );
