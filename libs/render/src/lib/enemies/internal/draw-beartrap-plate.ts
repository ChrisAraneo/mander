import { ENEMY_WIDTH } from '@mander/engine';
import { createRoundRectStep } from '../../canvas/create-round-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { createOutlineStep } from '../../stroke/create-outline-step';
import type { CanvasStep } from '../../types/canvas-step';
import {
  HALF_WIDTH,
  HALF_HEIGHT,
  PLATE_HEIGHT,
  BEARTRAP_STEEL,
} from './consts';

const BEARTRAP_SHADOW = '#5A6673';

export const drawBeartrapPlate: CanvasStep = createSequenceStep([
  drawBeginPath,
  createRoundRectStep(
    -HALF_WIDTH + 1,
    HALF_HEIGHT - PLATE_HEIGHT,
    ENEMY_WIDTH - 2,
    PLATE_HEIGHT,
    2,
  ),
  createOutlineStep(),
  createStyleStep({ fillStyle: BEARTRAP_SHADOW }),
  drawFill,
  createStyleStep({ fillStyle: BEARTRAP_STEEL }),
  drawBeginPath,
  createRoundRectStep(
    -HALF_WIDTH + 3,
    HALF_HEIGHT - PLATE_HEIGHT + 1.5,
    ENEMY_WIDTH - 6,
    2,
    1,
  ),
  drawFill,
]);
