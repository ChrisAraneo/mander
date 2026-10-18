import { createRectStep } from '../../canvas/create-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import { LEG_TOP, LEG_HEIGHT } from './consts';

export const drawPlayerAirborneLegs: CanvasStep = createSequenceStep([
  createRectStep(-7, LEG_TOP, 5, LEG_HEIGHT - 3),
  createRectStep(2, LEG_TOP + 3, 5, LEG_HEIGHT - 3),
]);
