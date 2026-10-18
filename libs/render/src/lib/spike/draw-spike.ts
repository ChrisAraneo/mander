import type { Level } from '@mander/model';
import { draw } from '../canvas/draw';
import { createSpikeStep } from './create-spike-step';

export const drawSpike = (
  context: CanvasRenderingContext2D,
  level: Level,
  column: number,
  row: number,
): void => draw(context, createSpikeStep(level, column, row));
