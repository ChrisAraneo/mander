import { match } from 'ts-pattern';
import type { GameState } from '../../types/game-state';
import { patchQueuedJump } from './internal/patch-queued-jump';

export const handleJumpStart = (state: GameState): GameState =>
  match(state.input.isJump)
    .with(true, () => state)
    .otherwise(() => patchQueuedJump(state));
