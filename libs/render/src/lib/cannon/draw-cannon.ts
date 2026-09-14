import type { Cannon } from '@mander/model';

import { paint } from '../canvas';
import { createCannonStep } from './create-cannon-step';

export const drawCannon = (
  context: CanvasRenderingContext2D,
  cannon: Cannon,
): void => paint(context, createCannonStep(cannon));
