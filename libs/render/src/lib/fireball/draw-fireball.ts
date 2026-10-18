import type { Fireball } from '@mander/model';
import { draw } from '../canvas/draw';
import { createFireballStep } from './create-fireball-step';

export const drawFireball = (
  context: CanvasRenderingContext2D,
  fireball: Fireball,
  time: number,
): void => draw(context, createFireballStep(fireball, time));
