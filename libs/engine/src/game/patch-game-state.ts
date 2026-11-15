import { reduce } from 'lodash-es';
import type { Action } from '../state/types/action';
import type { Clock } from '../state/types/clock';
import type { GameState } from '../state/types/game-state';
import { nextGameState } from './next-game-state';

export const patchGameState = (
  state: GameState,
  actions: Action[],
  now: Clock,
): GameState =>
  reduce(
    actions,
    (current, action) => nextGameState(current, action, now),
    state,
  );
