import { getFireballHeading, getFireballPosition } from '@mander/engine';
import type { Fireball } from '@mander/model';
import type { CanvasStep } from '../types/canvas-step';
import { EMBER_FIREBALL } from './consts';
import { createFlameStep } from './create-flame-step';
import { getFlicker } from './get-flicker';
import { FIREBALL_RADIUS } from './internal/consts';

export const createFireballStep = (
  fireball: Fireball,
  time: number,
): CanvasStep =>
  createFlameStep(
    getFireballPosition(fireball),
    getFireballHeading(fireball),
    FIREBALL_RADIUS * getFlicker(fireball.angle, time),
    EMBER_FIREBALL,
  );
