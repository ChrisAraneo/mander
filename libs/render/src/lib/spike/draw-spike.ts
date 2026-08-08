import type { Level } from '@mander/model';

import { paint } from '../canvas';
import { spikeStep } from './spike-step';

export const drawSpike = (
  context: CanvasRenderingContext2D,
  level: Level,
  tileX: number,
  tileY: number,
): void => paint(context, spikeStep(level, tileX, tileY));
