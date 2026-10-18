import { createArcStep } from '../../canvas/create-arc-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import type { CanvasStep } from '../../types/canvas-step';
import { HEAD_CENTER_Y, HEAD_RADIUS } from './consts';

export const drawPlayerSkullPath: CanvasStep = createSequenceStep([
  drawBeginPath,
  createArcStep(1, HEAD_CENTER_Y, HEAD_RADIUS, 0, Math.PI * 2),
]);
