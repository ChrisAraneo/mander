import { createLineToStep } from '../../canvas/create-line-to-step';
import { createMoveToStep } from '../../canvas/create-move-to-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawStroke } from '../../canvas/draw-stroke';
import type { CanvasStep } from '../../types/canvas-step';

export const drawEnemyDeadEyes: CanvasStep = createSequenceStep([
  createStyleStep({ lineWidth: 1.2 }),
  drawBeginPath,
  createMoveToStep(-6, -6),
  createLineToStep(-1.5, -2),
  createMoveToStep(-1.5, -6),
  createLineToStep(-6, -2),
  createMoveToStep(1, -6),
  createLineToStep(5.5, -2),
  createMoveToStep(5.5, -6),
  createLineToStep(1, -2),
  drawStroke,
]);
