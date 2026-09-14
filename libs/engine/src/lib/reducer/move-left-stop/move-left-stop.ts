import type { GameState } from '../../state/types/game-state';
import { patchInput } from '../../state/patch-input';

export const moveLeftStop = (state: GameState): GameState =>
  patchInput(state, { isLeft: false });
