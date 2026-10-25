import type { GameState } from '@mander/engine';

export interface GameFrame {
  previous: GameState;
  current: GameState;
}
