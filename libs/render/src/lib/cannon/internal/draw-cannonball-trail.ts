import { createEllipseStep } from '../../canvas/create-ellipse-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import type { CanvasStep } from '../../types/canvas-step';

const TRAIL_LENGTH = 15;

const TRAIL_HEIGHT = 3.2;

const TRAIL_COLOR = 'RGBA(255, 158, 61, 0.45)';

export const drawCannonballTrail: CanvasStep = createSequenceStep([
  createStyleStep({ fillStyle: TRAIL_COLOR }),
  drawBeginPath,
  createEllipseStep(
    -TRAIL_LENGTH / 2,
    0,
    TRAIL_LENGTH,
    TRAIL_HEIGHT,
    0,
    0,
    Math.PI * 2,
  ),
  drawFill,
]);
