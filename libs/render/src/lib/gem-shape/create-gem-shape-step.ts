import { createContextStyleStep } from '../canvas/create-context-style-step';
import { createLineToStep } from '../canvas/create-line-to-step';
import { createMoveToStep } from '../canvas/create-move-to-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createStyleStep } from '../canvas/create-style-step';
import { drawBeginPath } from '../canvas/draw-begin-path';
import { drawFill } from '../canvas/draw-fill';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { drawStroke } from '../canvas/draw-stroke';
import { createShadeFill } from '../shade/create-shade-fill';
import { createOutlineStep } from '../stroke/create-outline-step';
import type { CanvasStep } from '../types/canvas-step';
import type { ShadeColors } from '../types/shade-colors';
import { CROWN } from './internal/consts';
import { createGemShapePathStep } from './internal/create-gem-shape-path-step';

export const createGemShapeStep = (
  centerX: number,
  centerY: number,
  halfWidth: number,
  halfHeight: number,
  colors: ShadeColors,
): CanvasStep =>
  createSequenceStep([
    drawSave,
    createGemShapePathStep(centerX, centerY, halfWidth, halfHeight),
    createOutlineStep(),
    createContextStyleStep((context) => ({
      fillStyle: createShadeFill(context, centerX, centerY, halfHeight, colors),
    })),
    drawFill,
    drawRestore,
    createStyleStep({ strokeStyle: colors.deep, lineWidth: 1 }),
    drawBeginPath,
    createMoveToStep(centerX - halfWidth, centerY - halfHeight * CROWN),
    createLineToStep(centerX + halfWidth, centerY - halfHeight * CROWN),
    drawStroke,
  ]);
