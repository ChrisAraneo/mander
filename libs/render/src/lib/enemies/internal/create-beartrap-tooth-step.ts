import { createLineToStep } from '../../canvas/create-line-to-step';
import { createMoveToStep } from '../../canvas/create-move-to-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawClosePath } from '../../canvas/draw-close-path';
import type { CanvasStep } from '../../types/canvas-step';
import { JAW_THICKNESS } from './consts';

const TOOTH_LENGTH = 3.5;

const TOOTH_HALF_HEIGHT = 1.6;

export const createBeartrapToothStep = (toothY: number): CanvasStep =>
  createSequenceStep([
    createMoveToStep(JAW_THICKNESS / 2, toothY - TOOTH_HALF_HEIGHT),
    createLineToStep(JAW_THICKNESS / 2 + TOOTH_LENGTH, toothY),
    createLineToStep(JAW_THICKNESS / 2, toothY + TOOTH_HALF_HEIGHT),
    drawClosePath,
  ]);
