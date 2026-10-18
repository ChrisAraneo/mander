import { type Level, TILE_SIZE } from '@mander/model';
import { createConditionalStep } from '../../canvas/create-conditional-step';
import { createFillRectStep } from '../../canvas/create-fill-rect-step';
import type { CanvasStep } from '../../types/canvas-step';
import { isSolidAt } from '../is-solid-at';
import type { TileEdge } from './types/tile-edge';

export const createTileEdgeStep = (
  level: Level,
  column: number,
  row: number,
  edge: TileEdge,
): CanvasStep =>
  createConditionalStep(
    !isSolidAt(level, column + edge.column, row + edge.row),
    createFillRectStep(
      column * TILE_SIZE + edge.x,
      row * TILE_SIZE + edge.y,
      edge.width,
      edge.height,
    ),
  );
