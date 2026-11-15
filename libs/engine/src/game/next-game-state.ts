import { pipe } from 'remeda';
import type { Action } from '../state/types/action';
import type { Clock } from '../state/types/clock';
import type { GameState } from '../state/types/game-state';
import { computeGameActionStart } from './internal/compute-game-action-start';
import { handleGameAction } from './internal/handle-game-action';
import { patchGameActionTime } from './internal/patch-game-action-time';

export const nextGameState = (
  state: GameState,
  action: Action,
  now: Clock,
): GameState =>
  pipe(
    { state, action, now },
    computeGameActionStart,
    handleGameAction,
    patchGameActionTime,
  );
