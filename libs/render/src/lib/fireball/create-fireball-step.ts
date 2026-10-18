import { getFireballPosition } from '@mander/engine';
import type { Fireball } from '@mander/model';
import type { CanvasStep } from '../types/canvas-step';
import { EMBER_FIREBALL } from './consts';
import { createFireballFlameStep } from './internal/create-fireball-flame-step';

export const createFireballStep = (
  fireball: Fireball,
  time: number,
): CanvasStep =>
  createFireballFlameStep(
    fireball,
    getFireballPosition(fireball),
    time,
    EMBER_FIREBALL,
  );
