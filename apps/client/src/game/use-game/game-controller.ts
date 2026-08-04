import type { Action, GameState } from '@mander/engine';
import type { ShallowRef } from 'vue';

import type { ReplayController } from '../use-replay';

export interface GameController {
  state: ShallowRef<GameState>;
  worldName: string;
  levelCount: number;
  replay: ReplayController;
  dispatch(action: Action): void;
  nextLevel(): void;
  restart(): void;
}
