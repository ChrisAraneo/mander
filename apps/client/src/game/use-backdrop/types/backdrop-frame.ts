import type { GameState } from '@mander/engine';

export interface BackdropFrame {
  previous: GameState;
  current: GameState;
}
