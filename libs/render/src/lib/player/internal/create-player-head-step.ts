import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawFill } from '../../canvas/draw-fill';
import { outline } from '../../stroke/outline';
import type { CanvasStep } from '../../types/canvas-step';
import type { PlayerColors } from '../types/player-colors';
import { createPlayerEyeStep } from './create-player-eye-step';
import { createPlayerHairStep } from './create-player-hair-step';
import { drawPlayerSkullPath } from './draw-player-skull-path';

export const createPlayerHeadStep = (
  isDying: boolean,
  colors: PlayerColors,
): CanvasStep =>
  createSequenceStep([
    drawPlayerSkullPath,
    outline(),
    createStyleStep({ fillStyle: colors.skin }),
    drawFill,
    createPlayerHairStep(colors),
    createPlayerEyeStep(isDying, colors),
  ]);
