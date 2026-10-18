import type { Level } from '@mander/model';
import { draw } from '../canvas/draw';
import { createTileEdgesStep } from './create-tile-edges-step';

export const strokeTileEdges = (
  context: CanvasRenderingContext2D,
  level: Level,
  column: number,
  row: number,
): void => draw(context, createTileEdgesStep(level, column, row));
