import { omit } from 'lodash-es';
import type { GameState } from './types/game-state';

export const removeUpdateTime = (
  state: GameState,
): Omit<GameState, 'updateTime'> => omit(state, 'updateTime');
