import { type Level, TILE_SIZE } from '@mander/model';
import { chain } from '@mander/utils';
import { createConditionalStep } from '../../canvas/create-conditional-step';
import { createFillRectStep } from '../../canvas/create-fill-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { createMaterialStep } from '../../material/create-material-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';
import { createTileEdgesStep } from '../create-tile-edges-step';
import { isSolidAt } from '../is-solid-at';
import { CAP_HEIGHT, CAP_HIGHLIGHT_HEIGHT } from './consts';

export const createSolidTileStep = (
  level: Level,
  column: number,
  row: number,
  style: MaterialStyle,
): CanvasStep =>
  chain({ pixelX: column * TILE_SIZE, pixelY: row * TILE_SIZE })
    .thru(({ pixelX, pixelY }) => ({
      pixelX,
      pixelY,
      tile: level.tiles[row][column],
    }))
    .thru(({ pixelX, pixelY, tile }) =>
      createSequenceStep([
        createStyleStep({ fillStyle: style.base }),
        createFillRectStep(pixelX, pixelY, TILE_SIZE, TILE_SIZE),
        createMaterialStep(tile, pixelX, pixelY, style),
        createConditionalStep(
          !isSolidAt(level, column, row - 1),
          createStyleStep({ fillStyle: style.cap }),
          createFillRectStep(pixelX, pixelY, TILE_SIZE, CAP_HEIGHT),
          createStyleStep({ fillStyle: style.capHighlight }),
          createFillRectStep(pixelX, pixelY, TILE_SIZE, CAP_HIGHLIGHT_HEIGHT),
        ),
        createTileEdgesStep(level, column, row),
      ]),
    )
    .value();
