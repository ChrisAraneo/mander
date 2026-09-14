import type { GameState } from '../../state/types/game-state';
import { patchInput } from '../../state/patch-input';

export const moveLeftStart = (state: GameState): GameState =>
  patchInput(state, { isLeft: true });
