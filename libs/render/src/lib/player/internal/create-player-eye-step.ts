import { match } from 'ts-pattern';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { PlayerColors } from '../types/player-colors';
import { createPlayerDeadEyeStep } from './create-player-dead-eye-step';
import { drawPlayerLivingEye } from './draw-player-living-eye';

export const createPlayerEyeStep = (
  isDying: boolean,
  colors: PlayerColors,
): CanvasStep =>
  createSequenceStep([
    createStyleStep({ fillStyle: colors.eye }),
    match(isDying)
      .with(true, () => createPlayerDeadEyeStep(colors))
      .otherwise(() => drawPlayerLivingEye),
  ]);
