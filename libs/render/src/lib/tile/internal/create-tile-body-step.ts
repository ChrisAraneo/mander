import { type Tile, TILE_SIZE } from '@mander/model';
import { createConditionalStep } from '../../canvas/create-conditional-step';
import { createFillRectStep } from '../../canvas/create-fill-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { createMaterialStep } from '../../material/create-material-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';
import { CAP_HEIGHT, CAP_HIGHLIGHT_HEIGHT } from './consts';

export const createTileBodyStep = (
  tile: Tile,
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
  hasCap: boolean,
): CanvasStep =>
  createSequenceStep([
    createStyleStep({ fillStyle: style.base }),
    createFillRectStep(pixelX, pixelY, TILE_SIZE, TILE_SIZE),
    createMaterialStep(tile, pixelX, pixelY, style),
    createConditionalStep(
      hasCap,
      createStyleStep({ fillStyle: style.cap }),
      createFillRectStep(pixelX, pixelY, TILE_SIZE, CAP_HEIGHT),
      createStyleStep({ fillStyle: style.capHighlight }),
      createFillRectStep(pixelX, pixelY, TILE_SIZE, CAP_HIGHLIGHT_HEIGHT),
    ),
  ]);
