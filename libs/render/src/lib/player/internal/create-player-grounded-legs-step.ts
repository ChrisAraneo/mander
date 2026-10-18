import { createRectStep } from '../../canvas/create-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import { LEG_TOP, LEG_HEIGHT } from './consts';

export const createPlayerGroundedLegsStep = (swing: number): CanvasStep =>
  createSequenceStep([
    createRectStep(-7 + swing / 2, LEG_TOP, 5, LEG_HEIGHT),
    createRectStep(2 - swing / 2, LEG_TOP, 5, LEG_HEIGHT),
  ]);
