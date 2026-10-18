import { createArcStep } from '../../canvas/create-arc-step';
import { createLineToStep } from '../../canvas/create-line-to-step';
import { createMoveToStep } from '../../canvas/create-move-to-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import type { CanvasStep } from '../../types/canvas-step';

export const createKeyBowPathStep = (
  centerX: number,
  centerY: number,
): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    createArcStep(centerX, centerY - 5, 4.5, 0, Math.PI * 2),
    createMoveToStep(centerX, centerY - 0.5),
    createLineToStep(centerX, centerY + 9),
  ]);
