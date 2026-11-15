import type { Action } from '../../state/types/action';
import type { Clock } from '../../state/types/clock';
import type { GameState } from '../../state/types/game-state';
import type { GameActionStart } from './types/game-action-start';

export const computeGameActionStart = ({
  state,
  action,
  now,
}: {
  state: GameState;
  action: Action;
  now: Clock;
}): GameActionStart => ({
  state,
  action,
  now,
  startTime: now(),
});
