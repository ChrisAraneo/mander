import { createFillRectStep } from '../../canvas/create-fill-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';

export const createSandStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  createSequenceStep([
    createStyleStep({ fillStyle: style.joint }),
    createFillRectStep(pixelX + 18, pixelY + 4, 8, 1),
    createFillRectStep(pixelX + 26, pixelY + 3, 4, 1),
    createFillRectStep(pixelX + 3, pixelY + 11, 7, 1),
    createFillRectStep(pixelX + 10, pixelY + 10, 6, 1),
    createFillRectStep(pixelX + 16, pixelY + 11, 5, 1),
    createFillRectStep(pixelX + 13, pixelY + 19, 8, 1),
    createFillRectStep(pixelX + 21, pixelY + 18, 6, 1),
    createFillRectStep(pixelX + 27, pixelY + 19, 3, 1),
    createFillRectStep(pixelX + 2, pixelY + 26, 6, 1),
    createFillRectStep(pixelX + 8, pixelY + 25, 7, 1),
    createFillRectStep(pixelX + 15, pixelY + 26, 4, 1),
    createStyleStep({ fillStyle: style.highlight }),
    createFillRectStep(pixelX + 5, pixelY + 15, 3, 2),
    createFillRectStep(pixelX + 24, pixelY + 12, 3, 2),
    createFillRectStep(pixelX + 22, pixelY + 24, 3, 2),
    createFillRectStep(pixelX + 4, pixelY + 21, 2, 1),
  ]);
