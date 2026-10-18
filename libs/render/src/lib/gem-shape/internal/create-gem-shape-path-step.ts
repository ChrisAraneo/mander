import { createLineToStep } from '../../canvas/create-line-to-step';
import { createMoveToStep } from '../../canvas/create-move-to-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawClosePath } from '../../canvas/draw-close-path';
import type { CanvasStep } from '../../types/canvas-step';
import { CROWN } from './consts';

export const createGemShapePathStep = (
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    createMoveToStep(centerX, centerY - halfHeight),
    createLineToStep(centerX + halfWidth, centerY - halfHeight * CROWN),
    createLineToStep(centerX, centerY + halfHeight),
    createLineToStep(centerX - halfWidth, centerY - halfHeight * CROWN),
    drawClosePath,
  ]);
