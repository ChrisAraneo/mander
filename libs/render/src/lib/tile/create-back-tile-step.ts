import { getBackTileAt, type Level, TILE_SIZE } from '@mander/model';
import { chain } from '@mander/utils';
import { createConditionalStep } from '../canvas/create-conditional-step';
import { createFillRectStep } from '../canvas/create-fill-rect-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createStyleStep } from '../canvas/create-style-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { BACK_SHADE } from '../material/consts';
import { createMaterialStep } from '../material/create-material-step';
import type { CanvasStep } from '../types/canvas-step';
import type { MaterialStyle } from '../types/material-style';
import { CAP_HEIGHT, CAP_HIGHLIGHT_HEIGHT } from './internal/consts';
import { isCoveredAt } from './is-covered-at';

export const createBackTileStep = (
  level: Level,
  column: number,
  row: number,
  style: MaterialStyle,
): CanvasStep =>
  chain({
    pixelX: column * TILE_SIZE,
    pixelY: row * TILE_SIZE,
    tile: getBackTileAt(level, column, row),
  })
    .thru(({ pixelX, pixelY, tile }) =>
      createSequenceStep([
        drawSave,
        createStyleStep({ fillStyle: style.base }),
        createFillRectStep(pixelX, pixelY, TILE_SIZE, TILE_SIZE),
        createMaterialStep(tile, pixelX, pixelY, style),
        createConditionalStep(
          !isCoveredAt(level, column, row - 1),
          createStyleStep({ fillStyle: style.cap }),
          createFillRectStep(pixelX, pixelY, TILE_SIZE, CAP_HEIGHT),
          createStyleStep({ fillStyle: style.capHighlight }),
          createFillRectStep(pixelX, pixelY, TILE_SIZE, CAP_HIGHLIGHT_HEIGHT),
        ),
        drawRestore,
        createStyleStep({ fillStyle: BACK_SHADE }),
        createFillRectStep(pixelX, pixelY, TILE_SIZE, TILE_SIZE),
      ]),
    )
    .value();
