import { getPlayerFireballPosition } from '@mander/engine';
import type { Fireball } from '@mander/model';
import type { CanvasStep } from '../types/canvas-step';
import { WHITE_FIREBALL } from './consts';
import { createFireballFlameStep } from './internal/create-fireball-flame-step';

export const createPlayerFireballStep = (
  fireball: Fireball,
  time: number,
): CanvasStep =>
  createFireballFlameStep(
    fireball,
    getPlayerFireballPosition(fireball),
    time,
    WHITE_FIREBALL,
  );
