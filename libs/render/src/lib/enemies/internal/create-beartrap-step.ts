import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import { createBeartrapJawsStep } from './create-beartrap-jaws-step';
import { drawBeartrapPan } from './draw-beartrap-pan';
import { drawBeartrapPlate } from './draw-beartrap-plate';
import { drawBeartrapSprings } from './draw-beartrap-springs';
import { getBeartrapJawTilt } from './get-beartrap-jaw-tilt';

export const createBeartrapStep = (isSnapped: boolean): CanvasStep =>
  createSequenceStep([
    drawBeartrapPlate,
    drawBeartrapPan,
    createBeartrapJawsStep(getBeartrapJawTilt(isSnapped)),
    drawBeartrapSprings,
  ]);
