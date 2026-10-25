import { map } from 'lodash-es';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { createOutlineStep } from '../../stroke/create-outline-step';
import type { CanvasStep } from '../../types/canvas-step';
import { BEARTRAP_TOOTH } from './consts';
import { createBeartrapToothStep } from './create-beartrap-tooth-step';

const TOOTH_Y_POSITIONS = [-4.5, -8.5, -12.5];

export const drawBeartrapTeeth: CanvasStep = createSequenceStep([
  drawBeginPath,
  createSequenceStep(map(TOOTH_Y_POSITIONS, createBeartrapToothStep)),
  createOutlineStep(),
  createStyleStep({ fillStyle: BEARTRAP_TOOTH }),
  drawFill,
]);
