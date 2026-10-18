import { createEllipseStep } from '../../canvas/create-ellipse-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import type { CanvasStep } from '../../types/canvas-step';
import type { FireballColors } from '../types/fireball-colors';
import { TAIL_LENGTH } from './consts';

const TAIL_HEIGHT = 4.5;

export const createFlameTailStep = (
  colors: FireballColors,
  length: number,
): CanvasStep =>
  createSequenceStep([
    createStyleStep({ fillStyle: colors.tail }),
    drawBeginPath,
    createEllipseStep(
      -length / 2,
      0,
      length,
      (TAIL_HEIGHT * length) / TAIL_LENGTH,
      0,
      0,
      Math.PI * 2,
    ),
    drawFill,
  ]);
