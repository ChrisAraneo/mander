import { createArcStep } from '../../canvas/create-arc-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import type { CanvasStep } from '../../types/canvas-step';
import { HEAD_CENTER_Y } from './consts';

export const drawPlayerLivingEye: CanvasStep = createSequenceStep([
  drawBeginPath,
  createArcStep(4.2, HEAD_CENTER_Y + 0.4, 1.5, 0, Math.PI * 2),
  drawFill,
]);
