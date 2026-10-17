import { patchInput } from '../../state/patch-input';
import type { GameState } from '../../types/game-state';

export const handleMoveLeftStart = (state: GameState): GameState =>
  patchInput(state, { isLeft: true });
