import { reduce as fold } from 'lodash-es';
import type { GameState } from '../types/game-state';
import { reduce } from './reduce';
import type { Action } from './types/action';

export const applyActions = (state: GameState, actions: Action[]): GameState =>
  fold(actions, (current, action) => reduce(current, action), state);
