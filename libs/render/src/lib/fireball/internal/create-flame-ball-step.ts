import { createArcStep } from '../../canvas/create-arc-step';
import { createContextStyleStep } from '../../canvas/create-context-style-step';
import { createRadialGradient } from '../../canvas/create-radial-gradient';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { createOutlineStep } from '../../stroke/create-outline-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { FireballColors } from '../types/fireball-colors';

export const createFlameBallStep = (
  radius: number,
  colors: FireballColors,
): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    createArcStep(0, 0, radius, 0, Math.PI * 2),
    createOutlineStep(),
    createContextStyleStep((context) => ({
      fillStyle: createRadialGradient(context, 0, 0, 1, 0, 0, radius, [
        [0, colors.core],
        [0.45, colors.flame],
        [1, colors.edge],
      ]),
    })),
    drawFill,
    createStyleStep({ fillStyle: colors.core }),
    drawBeginPath,
    createArcStep(0, 0, radius / 2.6, 0, Math.PI * 2),
    drawFill,
  ]);
