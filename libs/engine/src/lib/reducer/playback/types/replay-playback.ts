import type { GameState } from '../../../types/game-state';

export interface ReplayPlayback {
  step: number;
  index: number;
  state: GameState;
}
