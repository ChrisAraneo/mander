import { createArcStep } from '../../canvas/create-arc-step';
import { createContextStyleStep } from '../../canvas/create-context-style-step';
import { createRadialGradient } from '../../canvas/create-radial-gradient';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { outline } from '../../stroke/outline';
import type { CanvasStep } from '../../types/canvas-step';
import { CANNONBALL_RADIUS } from './consts';

const IRON_LIGHT = '#7C8496';

const IRON_DARK = '#171C26';

const SHINE_COLOR = 'RGBA(255, 255, 255, 0.55)';

export const drawCannonballIron: CanvasStep = createSequenceStep([
  drawBeginPath,
  createArcStep(0, 0, CANNONBALL_RADIUS, 0, Math.PI * 2),
  outline(),
  createContextStyleStep((context) => ({
    fillStyle: createRadialGradient(
      context,
      -CANNONBALL_RADIUS / 3,
      -CANNONBALL_RADIUS / 3,
      1,
      0,
      0,
      CANNONBALL_RADIUS,
      [
        [0, IRON_LIGHT],
        [1, IRON_DARK],
      ],
    ),
  })),
  drawFill,
  createStyleStep({ fillStyle: SHINE_COLOR }),
  drawBeginPath,
  createArcStep(
    -CANNONBALL_RADIUS / 3,
    -CANNONBALL_RADIUS / 3,
    CANNONBALL_RADIUS / 4,
    0,
    Math.PI * 2,
  ),
  drawFill,
]);
