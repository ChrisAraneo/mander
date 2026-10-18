import { createRoundRectStep } from '../../canvas/create-round-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { outline } from '../../stroke/outline';
import type { CanvasStep } from '../../types/canvas-step';
import { HALF_HEIGHT, PLATE_HEIGHT, BEARTRAP_TOOTH } from './consts';

export const drawBeartrapPan: CanvasStep = createSequenceStep([
  drawBeginPath,
  createRoundRectStep(-5, HALF_HEIGHT - PLATE_HEIGHT - 3, 10, 3, 1),
  outline(),
  createStyleStep({ fillStyle: BEARTRAP_TOOTH }),
  drawFill,
]);
