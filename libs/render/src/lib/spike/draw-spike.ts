import type { Level } from '@mander/model';

import { paint } from '../canvas';
import { createSpikeStep } from './create-spike-step';

export const drawSpike = (
  context: CanvasRenderingContext2D,
  level: Level,
  tileX: number,
  tileY: number,
): void => paint(context, createSpikeStep(level, tileX, tileY));
