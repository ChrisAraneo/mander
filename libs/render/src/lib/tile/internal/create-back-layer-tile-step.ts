import { type Level, getBackTileAt, isSolidTile } from '@mander/model';
import { match } from 'ts-pattern';
import { drawNothing } from '../../canvas/draw-nothing';
import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialPalette } from '../../types/material-palette';
import { createBackTileStep } from '../create-back-tile-step';

export const createBackLayerTileStep = (
  level: Level,
  column: number,
  row: number,
  materials: MaterialPalette,
): CanvasStep =>
  match(getBackTileAt(level, column, row))
    .when(isSolidTile, (tile) =>
      createBackTileStep(level, column, row, materials(tile)),
    )
    .otherwise(() => drawNothing);
