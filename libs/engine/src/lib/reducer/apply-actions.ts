import { reduce as fold } from 'lodash-es';

import type { Action } from '../actions/actions';
import { reduce } from './reduce';
import type { GameState } from '../state/types/game-state';

export const applyActions = (state: GameState, actions: Action[]): GameState =>
  fold(actions, (current, action) => reduce(current, action), state);
