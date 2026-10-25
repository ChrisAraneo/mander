import { reduce } from 'lodash-es';
import type { GameState } from '../types/game-state';
import { nextGameState } from './next-game-state';
import type { Action } from './types/action';
import type { Clock } from './types/clock';

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
