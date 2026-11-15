import type { Clock } from '../../../state/types/clock';
import type { GameState } from '../../../state/types/game-state';

export interface GameActionResult {
  now: Clock;
  startTime: number;
  nextState: GameState;
}
