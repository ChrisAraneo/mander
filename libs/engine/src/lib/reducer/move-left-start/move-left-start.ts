import type { GameState } from '../../state/types/game-state';
import { withInput } from '../../state/with-input';

export const moveLeftStart = (state: GameState): GameState =>
  withInput(state, { isLeft: true });
