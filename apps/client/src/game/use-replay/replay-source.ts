import type { GameState, Replay } from '@mander/engine';

export interface ReplaySource {
  replay(): Replay;
  initialState(): GameState;
  render(state: GameState): void;
  onStop(): void;
}
