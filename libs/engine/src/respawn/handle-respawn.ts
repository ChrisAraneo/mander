import { match } from 'ts-pattern';
import type { GameState } from '../state/types/game-state';
import { patchRespawnedState } from './internal/patch-respawned-state';

export const handleRespawn = (state: GameState): GameState =>
  match(state.status)
    .with('PLAYING', () => patchRespawnedState(state))
    .with('CHEST', () => state)
    .with('COMPLETE', () => state)
    .with('GAME_OVER', () => state)
    .exhaustive(() => state);
