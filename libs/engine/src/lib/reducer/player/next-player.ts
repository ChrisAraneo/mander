import type { Level, Player } from '@mander/model';
import { pipe } from 'remeda';
import type { InputState } from '../../types/input-state';
import { computePlayerStepDelta } from './internal/compute-player-step-delta';
import { computePlayerStepFall } from './internal/compute-player-step-fall';
import { computePlayerStepHorizontalMove } from './internal/compute-player-step-horizontal-move';
import { computePlayerStepIntent } from './internal/compute-player-step-intent';
import { computePlayerStepVerticalMove } from './internal/compute-player-step-vertical-move';
import { patchPlayerStep } from './internal/patch-player-step';

export const nextPlayer = (
  level: Level,
  player: Player,
  input: InputState,
  elapsedSeconds: number,
): Player =>
  pipe(
    { level, player, input, elapsedSeconds },
    computePlayerStepDelta,
    computePlayerStepIntent,
    computePlayerStepFall,
    computePlayerStepHorizontalMove,
    computePlayerStepVerticalMove,
    patchPlayerStep,
  );
