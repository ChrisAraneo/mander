import { match } from 'ts-pattern';
import type { GameState } from '../../types/game-state';
import { patchPlayingTick } from './internal/patch-playing-tick';

export const handleTick = (state: GameState, deltaSeconds: number): GameState =>
  match(state.status)
    .with('PLAYING', () => patchPlayingTick(state, deltaSeconds))
    .with('CHEST', () => state)
    .with('COMPLETE', () => state)
    .with('GAME_OVER', () => state)
    .exhaustive(() => state);
