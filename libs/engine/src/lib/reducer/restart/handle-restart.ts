import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';

export const handleRestart = (level: GameLevel): GameState =>
  createInitialState(level, 0, []);
