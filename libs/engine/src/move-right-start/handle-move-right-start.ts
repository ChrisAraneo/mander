import { patchInput } from '../state/patch-input';
import type { GameState } from '../state/types/game-state';

export const handleMoveRightStart = (state: GameState): GameState =>
  patchInput(state, { isRight: true });
