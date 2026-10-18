import { createRectStep } from '../../canvas/create-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import type { CanvasStep } from '../../types/canvas-step';

export const createKeyTeethPathStep = (
  centerX: number,
  centerY: number,
): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    createRectStep(centerX, centerY + 3, 5, 2.5),
    createRectStep(centerX, centerY + 7, 6, 2.5),
  ]);
