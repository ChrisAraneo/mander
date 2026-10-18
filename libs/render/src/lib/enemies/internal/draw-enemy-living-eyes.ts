import { createArcStep } from '../../canvas/create-arc-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import type { CanvasStep } from '../../types/canvas-step';

export const drawEnemyLivingEyes: CanvasStep = createSequenceStep([
  drawBeginPath,
  createArcStep(-3, -4, 1.4, 0, Math.PI * 2),
  createArcStep(4, -4, 1.4, 0, Math.PI * 2),
  drawFill,
]);
