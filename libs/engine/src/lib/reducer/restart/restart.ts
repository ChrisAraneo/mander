import type { GameLevel } from '../../types/game-level';
import { createInitialState } from '../../state/create-initial-state';
import type { GameState } from '../../state/types/game-state';

export const restart = (level: GameLevel): GameState =>
  createInitialState(level, 0, []);
