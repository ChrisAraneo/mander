import { match } from 'ts-pattern';

import type { GameState } from '../../state/types/game-state';

export const close = (state: GameState): GameState =>
  match(state.status)
    .with('CHEST', (): GameState => ({ ...state, status: 'PLAYING' }))
    .otherwise((): GameState => state);
