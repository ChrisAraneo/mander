import { createArcStep } from '../../canvas/create-arc-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { createOutlineStep } from '../../stroke/create-outline-step';
import type { CanvasStep } from '../../types/canvas-step';
import { JAW_HINGE_X, JAW_HINGE_Y } from './consts';

const BEARTRAP_SPRING = '#B4603A';

export const createBeartrapSpringStep = (side: number): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    createArcStep(side * JAW_HINGE_X, JAW_HINGE_Y, 2.6, 0, Math.PI * 2),
    createOutlineStep(),
    createStyleStep({ fillStyle: BEARTRAP_SPRING }),
    drawFill,
  ]);
