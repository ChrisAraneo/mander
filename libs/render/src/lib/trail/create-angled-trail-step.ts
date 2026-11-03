import { createEllipseStep } from '../canvas/create-ellipse-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createStyleStep } from '../canvas/create-style-step';
import { drawBeginPath } from '../canvas/draw-begin-path';
import { drawFill } from '../canvas/draw-fill';
import type { CanvasStep } from '../types/canvas-step';

export const createAngledTrailStep = (
  color: string,
  length: number,
  height: number,
  angle: number,
): CanvasStep =>
  createSequenceStep([
    createStyleStep({ fillStyle: color }),
    drawBeginPath,
    createEllipseStep(
      (-length / 2) * Math.cos(angle),
      (-length / 2) * Math.sin(angle),
      length,
      height,
      angle,
      0,
      Math.PI * 2,
    ),
    drawFill,
  ]);
