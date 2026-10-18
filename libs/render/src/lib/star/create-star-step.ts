import { createContextStyleStep } from '../canvas/create-context-style-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { drawFill } from '../canvas/draw-fill';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { outline } from '../stroke/outline';
import type { CanvasStep } from '../types/canvas-step';
import type { StarColors } from '../types/star-colors';
import { createStarFill } from './internal/create-star-fill';
import { createStarPathStep } from './internal/create-star-path-step';

export const createStarStep = (
  centerX: number,
  centerY: number,
  radius: number,
  colors: StarColors,
): CanvasStep =>
  createSequenceStep([
    drawSave,
    createStarPathStep(centerX, centerY, radius),
    outline(),
    createContextStyleStep((context) => ({
      fillStyle: createStarFill(context, centerX, centerY, radius, colors),
    })),
    drawFill,
    drawRestore,
  ]);
