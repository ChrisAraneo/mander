import { getFireballHeading, getPlayerFireballPosition } from '@mander/engine';
import type { Fireball } from '@mander/model';
import type { CanvasStep } from '../types/canvas-step';
import { WHITE_FIREBALL } from './consts';
import { createFlameStep } from './create-flame-step';
import { getFlicker } from './get-flicker';
import { FIREBALL_RADIUS } from './internal/consts';

export const createPlayerFireballStep = (
  fireball: Fireball,
  time: number,
): CanvasStep =>
  createFlameStep(
    getPlayerFireballPosition(fireball),
    getFireballHeading(fireball),
    FIREBALL_RADIUS * getFlicker(fireball.angle, time),
    WHITE_FIREBALL,
  );
