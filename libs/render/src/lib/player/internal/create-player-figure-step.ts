import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { PlayerColors } from '../types/player-colors';
import { createPlayerBodyStep } from './create-player-body-step';
import { createPlayerHeadStep } from './create-player-head-step';
import { createPlayerLegsStep } from './create-player-legs-step';

export const createPlayerFigureStep = (
  isGrounded: boolean,
  isDying: boolean,
  swing: number,
  colors: PlayerColors,
): CanvasStep =>
  createSequenceStep([
    createPlayerLegsStep(isGrounded, swing, colors),
    createPlayerBodyStep(swing, colors),
    createPlayerHeadStep(isDying, colors),
  ]);
