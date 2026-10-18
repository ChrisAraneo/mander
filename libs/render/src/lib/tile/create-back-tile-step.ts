import { getBackTileAt, type Level, TILE_SIZE, chain } from '@mander/model';
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

export const createBackTileStep = (
  level: Level,
  column: number,
  row: number,
  style: MaterialStyle,
): CanvasStep =>
  chain({ pixelX: column * TILE_SIZE, pixelY: row * TILE_SIZE })
    .thru(({ pixelX, pixelY }) =>
      createSequenceStep([
        drawSave,
        createTileBodyStep(
          getBackTileAt(level, column, row),
          pixelX,
          pixelY,
          style,
          !isCoveredAt(level, column, row - 1),
        ),
        drawRestore,
        createStyleStep({ fillStyle: BACK_SHADE }),
        createFillRectStep(pixelX, pixelY, TILE_SIZE, TILE_SIZE),
      ]),
    )
    .value();
