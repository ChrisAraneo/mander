import { createArcStep } from '../canvas/create-arc-step';
import { createContextStyleStep } from '../canvas/create-context-style-step';
import { createRadialGradient } from '../canvas/create-radial-gradient';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createStyleStep } from '../canvas/create-style-step';
import { drawBeginPath } from '../canvas/draw-begin-path';
import { drawFill } from '../canvas/draw-fill';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { outline } from '../stroke/outline';
import type { CanvasStep } from '../types/canvas-step';
import type { SphereColors } from './types/sphere-colors';

export const createShadedSphereStep = (
  centerX: number,
  centerY: number,
  radius: number,
  colors: SphereColors,
): CanvasStep =>
  createSequenceStep([
    drawSave,
    drawBeginPath,
    createArcStep(centerX, centerY, radius, 0, Math.PI * 2),
    outline(),
    createContextStyleStep((context) => ({
      fillStyle: createRadialGradient(
        context,
        centerX - radius / 3,
        centerY - radius / 3,
        1,
        centerX,
        centerY,
        radius,
        [
          [0, colors.light],
          [1, colors.deep],
        ],
      ),
    })),
    drawFill,
    drawRestore,
    createStyleStep({ fillStyle: colors.shine }),
    drawBeginPath,
    createArcStep(
      centerX - radius / 3,
      centerY - radius / 3,
      radius / 4,
      0,
      Math.PI * 2,
    ),
    drawFill,
  ]);
