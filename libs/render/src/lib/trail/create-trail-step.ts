import { createEllipseStep } from '../canvas/create-ellipse-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createStyleStep } from '../canvas/create-style-step';
import { drawBeginPath } from '../canvas/draw-begin-path';
import { drawFill } from '../canvas/draw-fill';
import type { CanvasStep } from '../types/canvas-step';

export const createTrailStep = (
  color: string,
  length: number,
  height: number,
): CanvasStep =>
  createSequenceStep([
    createStyleStep({ fillStyle: color }),
    drawBeginPath,
    createEllipseStep(-length / 2, 0, length, height, 0, 0, Math.PI * 2),
    drawFill,
  ]);
