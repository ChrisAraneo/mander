import { TILE_SIZE } from '@mander/model';
import { createFillRectStep } from '../../canvas/create-fill-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';
import { HALF_TILE } from './consts';

export const createCeramicStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  createSequenceStep([
    createStyleStep({ fillStyle: style.joint }),
    createFillRectStep(pixelX + HALF_TILE, pixelY, 1, TILE_SIZE),
    createFillRectStep(pixelX, pixelY + HALF_TILE, TILE_SIZE, 1),
    createStyleStep({ fillStyle: style.highlight }),
    createFillRectStep(pixelX + 3, pixelY + 3, HALF_TILE - 7, 1),
    createFillRectStep(
      pixelX + HALF_TILE + 3,
      pixelY + HALF_TILE + 3,
      HALF_TILE - 7,
      1,
    ),
  ]);
