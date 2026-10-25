import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawFill } from '../../canvas/draw-fill';
import { createOutlineStep } from '../../stroke/create-outline-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { PlayerColors } from '../types/player-colors';
import { NO_EXTRA_OUTLINE_WIDTH } from './consts';
import { createPlayerEyeStep } from './create-player-eye-step';
import { createPlayerHairStep } from './create-player-hair-step';
import { drawPlayerSkullPath } from './draw-player-skull-path';

export const createPlayerHeadStep = (
  isDying: boolean,
  colors: PlayerColors,
): CanvasStep =>
  createSequenceStep([
    drawPlayerSkullPath,
    createOutlineStep(NO_EXTRA_OUTLINE_WIDTH, colors.outline),
    createStyleStep({ fillStyle: colors.skin }),
    drawFill,
    createPlayerHairStep(colors),
    createPlayerEyeStep(isDying, colors),
  ]);
