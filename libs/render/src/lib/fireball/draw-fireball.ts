import type { Fireball } from '@mander/model';

import { paint } from '../canvas';
import { fireballStep } from './fireball-step';

export const drawFireball = (
  context: CanvasRenderingContext2D,
  fireball: Fireball,
  time: number,
): void => paint(context, fireballStep(fireball, time));
