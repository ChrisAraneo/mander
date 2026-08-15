import type { Level } from '@mander/model';

import { paint } from '../canvas';
import { tileEdgesStep } from './tile-edges-step';

export const strokeTileEdges = (
  context: CanvasRenderingContext2D,
  level: Level,
  column: number,
  row: number,
): void => paint(context, tileEdgesStep(level, column, row));
