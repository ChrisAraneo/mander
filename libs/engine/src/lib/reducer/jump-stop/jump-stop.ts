import type { GameState } from '../../state/types/game-state';
import { withInput } from '../../state/with-input';

export const jumpStop = (state: GameState): GameState =>
  withInput(state, { isJump: false });
