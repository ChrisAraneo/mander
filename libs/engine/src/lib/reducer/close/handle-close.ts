import { match } from 'ts-pattern';
import type { GameState } from '../../types/game-state';

export const handleClose = (state: GameState): GameState =>
  match(state.status)
    .with('PLAYING', () => state)
    .with('CHEST', (): GameState => ({ ...state, status: 'PLAYING' }))
    .with('COMPLETE', () => state)
    .with('GAME_OVER', () => state)
    .exhaustive(() => state);
