import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { createInitialState } from '../start/create-initial-state';
import type { GameLevel } from '../state/types/game-level';
import type { GameState } from '../state/types/game-state';

export const handleRestart = (level: GameLevel): GameState =>
  createInitialState(level, FIRST_LEVEL_INDEX, []);
