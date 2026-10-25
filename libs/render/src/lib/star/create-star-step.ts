import { createContextStyleStep } from '../canvas/create-context-style-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { drawFill } from '../canvas/draw-fill';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { createShadeFill } from '../shade/create-shade-fill';
import { createOutlineStep } from '../stroke/create-outline-step';
import type { CanvasStep } from '../types/canvas-step';
import type { ShadeColors } from '../types/shade-colors';
import { createStarPathStep } from './internal/create-star-path-step';

export const createStarStep = (
  centerX: number,
  centerY: number,
  radius: number,
  colors: ShadeColors,
): CanvasStep =>
  createSequenceStep([
    drawSave,
    createStarPathStep(centerX, centerY, radius),
    createOutlineStep(),
    createContextStyleStep((context) => ({
      fillStyle: createShadeFill(context, centerX, centerY, radius, colors),
    })),
    drawFill,
    drawRestore,
  ]);
