import type { GameState } from '../../state/types/game-state';
import { patchInput } from '../../state/patch-input';

export const moveRightStart = (state: GameState): GameState =>
  patchInput(state, { isRight: true });
