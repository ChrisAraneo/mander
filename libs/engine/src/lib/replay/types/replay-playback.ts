import type { GameState } from '../../state/types/game-state';

export interface ReplayPlayback {
  elapsedMs: number;
  index: number;
  state: GameState;
}
