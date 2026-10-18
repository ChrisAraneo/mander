import { type Level, TILE_SIZE } from '@mander/model';
import { createConditionalStep } from '../../canvas/create-conditional-step';
import { createFillRectStep } from '../../canvas/create-fill-rect-step';
import { STROKE_WIDTH } from '../../stroke/consts';
import type { CanvasStep } from '../../types/canvas-step';
import { isSolidAt } from '../is-solid-at';
import type { TileCorner } from './types/tile-corner';

export const createTileCornerStep = (
  level: Level,
  column: number,
  row: number,
  corner: TileCorner,
): CanvasStep =>
  createConditionalStep(
    !isSolidAt(level, column + corner.column, row + corner.row) &&
      isSolidAt(level, column + corner.column, row) &&
      isSolidAt(level, column, row + corner.row),
    createFillRectStep(
      column * TILE_SIZE + corner.x,
      row * TILE_SIZE + corner.y,
      STROKE_WIDTH,
      STROKE_WIDTH,
    ),
  );
