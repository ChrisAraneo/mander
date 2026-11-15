import { patchInput } from '../state/patch-input';
import type { GameState } from '../state/types/game-state';

export const handleJumpStop = (state: GameState): GameState =>
  patchInput(state, { isJump: false });
