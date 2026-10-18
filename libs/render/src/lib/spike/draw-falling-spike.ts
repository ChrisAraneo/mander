import type { FallingSpike } from '@mander/model';
import { draw } from '../canvas/draw';
import { createFallingSpikeStep } from './create-falling-spike-step';

export const drawFallingSpike = (
  context: CanvasRenderingContext2D,
  spike: FallingSpike,
): void => draw(context, createFallingSpikeStep(spike));
