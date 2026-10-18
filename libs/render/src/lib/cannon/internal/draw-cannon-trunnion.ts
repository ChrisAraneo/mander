import { createArcStep } from '../../canvas/create-arc-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { outline } from '../../stroke/outline';
import type { CanvasStep } from '../../types/canvas-step';
import { BARREL_BACK, IRON_LIGHT, IRON_DARK } from './consts';

const TRUNNION_RADIUS = 5;

export const drawCannonTrunnion: CanvasStep = createSequenceStep([
  drawBeginPath,
  createArcStep(BARREL_BACK + 1, 0, TRUNNION_RADIUS, 0, Math.PI * 2),
  outline(),
  createStyleStep({ fillStyle: IRON_LIGHT }),
  drawFill,
  createStyleStep({ fillStyle: IRON_DARK }),
  drawBeginPath,
  createArcStep(BARREL_BACK + 1, 0, TRUNNION_RADIUS / 2.5, 0, Math.PI * 2),
  drawFill,
]);
