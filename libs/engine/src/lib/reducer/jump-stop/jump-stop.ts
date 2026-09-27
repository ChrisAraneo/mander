import type { GameState } from '../../state/types/game-state';
import { patchInput } from '../../state/patch-input';

export const jumpStop = (state: GameState): GameState =>
  patchInput(state, { isJump: false });
