import { createScaleStep } from '../../canvas/create-scale-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawRestore } from '../../canvas/draw-restore';
import { drawSave } from '../../canvas/draw-save';
import type { CanvasStep } from '../../types/canvas-step';
import { createBeartrapJawStep } from './create-beartrap-jaw-step';

export const createBeartrapJawsStep = (tilt: number): CanvasStep =>
  createSequenceStep([
    createBeartrapJawStep(tilt),
    drawSave,
    createScaleStep(-1, 1),
    createBeartrapJawStep(tilt),
    drawRestore,
  ]);
