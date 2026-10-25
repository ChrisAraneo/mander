import { createSequenceStep } from '../canvas/create-sequence-step';
import { createStyleStep } from '../canvas/create-style-step';
import { drawStroke } from '../canvas/draw-stroke';
import type { CanvasStep } from '../types/canvas-step';
import { STROKE_COLOR, STROKE_WIDTH } from './consts';

export const createOutlineStep = (
  lineWidth = 0,
  color: string = STROKE_COLOR,
): CanvasStep =>
  createSequenceStep([
    createStyleStep({
      strokeStyle: color,
      lineWidth: lineWidth + STROKE_WIDTH * 2,
      lineJoin: 'round',
    }),
    drawStroke,
  ]);
