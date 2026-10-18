import { createArcStep } from '../../canvas/create-arc-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawClip } from '../../canvas/draw-clip';
import { drawFill } from '../../canvas/draw-fill';
import { drawRestore } from '../../canvas/draw-restore';
import { drawSave } from '../../canvas/draw-save';
import type { CanvasStep } from '../../types/canvas-step';
import type { PlayerColors } from '../types/player-colors';
import { HEAD_CENTER_Y, HEAD_RADIUS } from './consts';
import { drawPlayerSkullPath } from './draw-player-skull-path';

export const createPlayerHairStep = (colors: PlayerColors): CanvasStep =>
  createSequenceStep([
    drawSave,
    drawPlayerSkullPath,
    drawClip,
    createStyleStep({ fillStyle: colors.hair }),
    drawBeginPath,
    createArcStep(
      0.5,
      HEAD_CENTER_Y - 1.5,
      HEAD_RADIUS - 0.2,
      Math.PI * 0.95,
      Math.PI * 2.02,
    ),
    drawFill,
    drawRestore,
  ]);
