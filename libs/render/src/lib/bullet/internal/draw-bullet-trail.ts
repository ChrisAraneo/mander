import { createEllipseStep } from '../../canvas/create-ellipse-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import type { CanvasStep } from '../../types/canvas-step';
import { ICE_BULLET } from '../consts';

const TRAIL_LENGTH = 18;

const TRAIL_HEIGHT = 2.8;

export const drawBulletTrail: CanvasStep = createSequenceStep([
  createStyleStep({ fillStyle: ICE_BULLET.trail }),
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
