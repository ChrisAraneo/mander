import type { GameState } from '@mander/engine';
import type { GameFrame } from '../types/game-frame';

export const createGameStartFrame = (state: GameState): GameFrame => ({
  previous: state,
  current: state,
});
