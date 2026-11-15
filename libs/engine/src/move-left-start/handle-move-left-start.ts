import { patchInput } from '../state/patch-input';
import type { GameState } from '../state/types/game-state';

export const handleMoveLeftStart = (state: GameState): GameState =>
  patchInput(state, { isLeft: true });
