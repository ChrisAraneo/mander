import { createFillRectStep } from '../../canvas/create-fill-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';

export const createStoneStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  createSequenceStep([
    createStyleStep({ fillStyle: style.joint }),
    createFillRectStep(pixelX + 6, pixelY + 7, 7, 5),
    createFillRectStep(pixelX + 19, pixelY + 16, 8, 6),
    createStyleStep({ fillStyle: style.highlight }),
    createFillRectStep(pixelX + 8, pixelY + 20, 6, 4),
    createFillRectStep(pixelX + 20, pixelY + 6, 5, 4),
  ]);
