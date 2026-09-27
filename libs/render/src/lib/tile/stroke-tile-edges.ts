import type { Level } from '@mander/model';

import { paint } from '../canvas';
import { createTileEdgesStep } from './create-tile-edges-step';

export const strokeTileEdges = (
  context: CanvasRenderingContext2D,
  level: Level,
  column: number,
  row: number,
): void => paint(context, createTileEdgesStep(level, column, row));
