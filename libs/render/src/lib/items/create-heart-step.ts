import { createContextStyleStep } from '../canvas/create-context-style-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { drawFill } from '../canvas/draw-fill';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { outline } from '../stroke/outline';
import type { CanvasStep } from '../types/canvas-step';
import { createHeartFill } from './internal/create-heart-fill';
import { createHeartPathStep } from './internal/create-heart-path-step';

export const createHeartStep = (
  centerX: number,
  centerY: number,
  lobe: number,
): CanvasStep =>
  createSequenceStep([
    drawSave,
    createHeartPathStep(centerX, centerY, lobe),
    outline(),
    createContextStyleStep((context) => ({
      fillStyle: createHeartFill(context, centerX, centerY, lobe),
    })),
    drawFill,
    drawRestore,
  ]);
