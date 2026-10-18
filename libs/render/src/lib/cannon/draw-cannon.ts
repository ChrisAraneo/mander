import type { Cannon } from '@mander/model';
import { draw } from '../canvas/draw';
import { createCannonStep } from './create-cannon-step';

export const drawCannon = (
  context: CanvasRenderingContext2D,
  cannon: Cannon,
): void => draw(context, createCannonStep(cannon));
