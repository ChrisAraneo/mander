import { getFireballPosition } from '@mander/engine';
import type { Fireball } from '@mander/model';
import type { CanvasStep } from '../types/canvas-step';
import { createFireballFlameStep } from './internal/create-fireball-flame-step';
import { getFireballColors } from './internal/get-fireball-colors';

export const createFireballStep = (
  fireball: Fireball,
  time: number,
): CanvasStep =>
  createFireballFlameStep(
    fireball,
    getFireballPosition(fireball),
    time,
    getFireballColors(fireball),
  );
