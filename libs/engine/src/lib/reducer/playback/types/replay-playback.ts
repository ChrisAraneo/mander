import type { GameState } from '../../../state/types/game-state';

export interface ReplayPlayback {
  step: number;
  index: number;
  state: GameState;
}
