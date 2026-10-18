import { match } from 'ts-pattern';
import type { GameState } from '../../types/game-state';
import { patchChosenItem } from './internal/patch-chosen-item';

export const handleChooseItem = (state: GameState, index: number): GameState =>
  match(state.status)
    .with('PLAYING', () => state)
    .with('CHEST', () => patchChosenItem(state, index))
    .with('COMPLETE', () => state)
    .with('GAME_OVER', () => state)
    .exhaustive(() => state);
