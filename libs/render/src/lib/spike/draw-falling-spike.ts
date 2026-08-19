import type { FallingSpike } from '@mander/model';

import { paint } from '../canvas';
import { fallingSpikeStep } from './falling-spike-step';

export const drawFallingSpike = (
  context: CanvasRenderingContext2D,
  spike: FallingSpike,
): void => paint(context, fallingSpikeStep(spike));
