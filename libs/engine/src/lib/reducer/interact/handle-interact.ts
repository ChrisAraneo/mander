import { match } from 'ts-pattern';
import type { GameState } from '../../types/game-state';
import { patchPlayingInteraction } from './internal/patch-playing-interaction';

export const handleInteract = (state: GameState): GameState =>
  match(state.status)
    .with('PLAYING', () => patchPlayingInteraction(state))
    .with('CHEST', () => state)
    .with('COMPLETE', () => state)
    .with('GAME_OVER', () => state)
    .exhaustive(() => state);
