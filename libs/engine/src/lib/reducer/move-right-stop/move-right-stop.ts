import type { GameState } from '../../state/types/game-state';
import { withInput } from '../../state/with-input';

export const moveRightStop = (state: GameState): GameState =>
  withInput(state, { isRight: false });
