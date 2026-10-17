import { patchInput } from '../../state/patch-input';
import type { GameState } from '../../types/game-state';

export const handleMoveRightStop = (state: GameState): GameState =>
  patchInput(state, { isRight: false });
