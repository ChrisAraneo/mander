import type { GameState } from '../../state/types/game-state';
import { withInput } from '../../state/with-input';

export const moveRightStart = (state: GameState): GameState =>
  withInput(state, { isRight: true });
