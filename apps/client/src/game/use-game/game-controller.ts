import type { Action, GameState } from '@mander/engine';
import type { ShallowRef } from 'vue';

export interface GameController {
  state: ShallowRef<GameState>;
  /** What the generator named today's world. */
  worldName: string;
  /** How many levels today's run holds, as the generator dealt them. */
  levelCount: number;
  dispatch(action: Action): void;
  nextLevel(): void;
}
