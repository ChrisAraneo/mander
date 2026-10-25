import {
  createInitialState,
  type GameLevel,
  type GameState,
} from '@mander/engine';

export const createStartState = (
  levels: GameLevel[],
  score: number,
): GameState => createInitialState(levels[0], 0, [], score);
