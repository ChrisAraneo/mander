import { getBackTileAt, type Level, type Tile, TILE_SIZE } from '@mander/model';
import { createFillRectStep } from '../canvas/create-fill-rect-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createStyleStep } from '../canvas/create-style-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { BACK_SHADE } from '../material/consts';
import type { CanvasStep } from '../types/canvas-step';
import type { MaterialStyle } from '../types/material-style';
import { createTileBodyStep } from './internal/create-tile-body-step';
import { isCoveredAt } from './is-covered-at';

const createShadedTileStep = (
  tile: Tile,
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
  hasCap: boolean,
): CanvasStep =>
  createSequenceStep([
    drawSave,
    createTileBodyStep(tile, pixelX, pixelY, style, hasCap),
    drawRestore,
    createStyleStep({ fillStyle: BACK_SHADE }),
    createFillRectStep(pixelX, pixelY, TILE_SIZE, TILE_SIZE),
  ]);

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
