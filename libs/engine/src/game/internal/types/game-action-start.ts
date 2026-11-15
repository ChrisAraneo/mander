import type { Action } from '../../../state/types/action';
import type { Clock } from '../../../state/types/clock';
import type { GameState } from '../../../state/types/game-state';

export interface GameActionStart {
  state: GameState;
  action: Action;
  now: Clock;
  startTime: number;
}
