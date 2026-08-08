import type { GameState } from '../../state/types/game-state';
import { withInput } from '../../state/with-input';

export const moveLeftStop = (state: GameState): GameState =>
  withInput(state, { isLeft: false });
