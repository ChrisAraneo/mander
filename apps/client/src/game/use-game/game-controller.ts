import type { Action, GameState } from '@mander/engine';
import type { ShallowRef } from 'vue';

export interface GameController {
  state: ShallowRef<GameState>;
  dispatch(action: Action): void;
  nextLevel(): void;
}
