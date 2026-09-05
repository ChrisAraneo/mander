import type { GameState, Replay } from '@mander/engine';

export interface ReplaySource {
  replay(): Replay;
  ghosts(): Replay[];
  initialState(): GameState;
  render(state: GameState, ghosts: GameState[]): void;
  onStop(): void;
}
