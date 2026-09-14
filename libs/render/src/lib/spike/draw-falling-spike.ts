import type { FallingSpike } from '@mander/model';

import { paint } from '../canvas';
import { createFallingSpikeStep } from './create-falling-spike-step';

export const drawFallingSpike = (
  context: CanvasRenderingContext2D,
  spike: FallingSpike,
): void => paint(context, createFallingSpikeStep(spike));
