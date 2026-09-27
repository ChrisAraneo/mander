import type { Fireball } from '@mander/model';

import { paint } from '../canvas';
import { createFireballStep } from './create-fireball-step';

export const drawFireball = (
  context: CanvasRenderingContext2D,
  fireball: Fireball,
  time: number,
): void => paint(context, createFireballStep(fireball, time));
