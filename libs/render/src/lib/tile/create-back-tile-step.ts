import { getBackTileAt, type Level, TILE_SIZE } from '@mander/model';
import type { CanvasStep } from '../types/canvas-step';
import type { MaterialStyle } from '../types/material-style';
import { createShadedTileStep } from './internal/create-shaded-tile-step';
import { isCoveredAt } from './is-covered-at';

export const createBackTileStep = (
  level: Level,
  column: number,
  row: number,
  style: MaterialStyle,
): CanvasStep =>
  createShadedTileStep(
    getBackTileAt(level, column, row),
    column * TILE_SIZE,
    row * TILE_SIZE,
    style,
    !isCoveredAt(level, column, row - 1),
  );
