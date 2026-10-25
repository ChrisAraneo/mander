import { match } from 'ts-pattern';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { createOutlineStep } from '../../stroke/create-outline-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { PlayerColors } from '../types/player-colors';
import { NO_EXTRA_OUTLINE_WIDTH } from './consts';
import { createPlayerGroundedLegsStep } from './create-player-grounded-legs-step';
import { drawPlayerAirborneLegs } from './draw-player-airborne-legs';

export const createPlayerLegsStep = (
  isGrounded: boolean,
  swing: number,
  colors: PlayerColors,
): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    match(isGrounded)
      .with(true, () => createPlayerGroundedLegsStep(swing))
      .otherwise(() => drawPlayerAirborneLegs),
    createOutlineStep(NO_EXTRA_OUTLINE_WIDTH, colors.outline),
    createStyleStep({ fillStyle: colors.legs }),
    drawFill,
  ]);
