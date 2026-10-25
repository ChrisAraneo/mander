import type { Triangle } from '@mander/model';
import { createContextStyleStep } from '../canvas/create-context-style-step';
import { createLineToStep } from '../canvas/create-line-to-step';
import { createLinearGradient } from '../canvas/create-linear-gradient';
import { createMoveToStep } from '../canvas/create-move-to-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { drawBeginPath } from '../canvas/draw-begin-path';
import { drawClosePath } from '../canvas/draw-close-path';
import { drawFill } from '../canvas/draw-fill';
import { createOutlineStep } from '../stroke/create-outline-step';
import type { CanvasStep } from '../types/canvas-step';
import type { ColorStop } from '../types/color-stop';

const SPIKE_STOPS: readonly ColorStop[] = [
  [0, '#8B90A3'],
  [1, '#DFE3EE'],
];

export const createProngStep = (
  [left, apex, right]: Triangle,
  stops: readonly ColorStop[] = SPIKE_STOPS,
): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    createMoveToStep(left.x, left.y),
    createLineToStep(apex.x, apex.y),
    createLineToStep(right.x, right.y),
    drawClosePath,
    createOutlineStep(),
    createContextStyleStep((context) => ({
      fillStyle: createLinearGradient(
        context,
        left.x,
        left.y,
        left.x,
        apex.y,
        stops,
      ),
    })),
    drawFill,
  ]);
