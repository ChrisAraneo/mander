import { createContextStyleStep } from '../../canvas/create-context-style-step';
import { createLinearGradient } from '../../canvas/create-linear-gradient';
import { createRoundRectStep } from '../../canvas/create-round-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { createOutlineStep } from '../../stroke/create-outline-step';
import type { CanvasStep } from '../../types/canvas-step';
import { BARREL_BACK, BARREL_LENGTH, IRON, IRON_DARK } from './consts';

const BARREL_HEIGHT = 13;

const MUZZLE_WIDTH = 5;

const MUZZLE_OVERHANG = 2.5;

const BARREL_LIT = '#8892A8';

export const drawCannonBarrel: CanvasStep = createSequenceStep([
  drawBeginPath,
  createRoundRectStep(
    BARREL_BACK,
    -BARREL_HEIGHT / 2,
    BARREL_LENGTH - BARREL_BACK,
    BARREL_HEIGHT,
    3,
  ),
  createRoundRectStep(
    BARREL_LENGTH - MUZZLE_WIDTH,
    -BARREL_HEIGHT / 2 - MUZZLE_OVERHANG,
    MUZZLE_WIDTH,
    BARREL_HEIGHT + MUZZLE_OVERHANG * 2,
    2,
  ),
  createOutlineStep(),
  createContextStyleStep((context) => ({
    fillStyle: createLinearGradient(
      context,
      0,
      -BARREL_HEIGHT / 2,
      0,
      BARREL_HEIGHT / 2,
      [
        [0, BARREL_LIT],
        [0.45, IRON],
        [1, IRON_DARK],
      ],
    ),
  })),
  drawFill,
]);
