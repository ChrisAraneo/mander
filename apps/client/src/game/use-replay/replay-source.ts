import type { GameState, Replay } from '@mander/engine';

export interface ReplaySource {
  getReplay(): Replay;
  getGhosts(): Replay[];
  getInitialState(): GameState;
  render(state: GameState, ghosts: GameState[]): void;
  handleStop(): void;
}
