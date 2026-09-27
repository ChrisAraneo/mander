import { match } from 'ts-pattern';

import type { GameState } from '../../state/types/game-state';
import { patchInput } from '../../state/patch-input';

export const jumpStart = (state: GameState): GameState =>
  match(state.input.isJump)
    .with(true, (): GameState => state)
    .otherwise((): GameState => ({
      ...patchInput(state, { isJump: true }),
      player: match({
        status: state.status,
        death: state.player.timers.death,
      })
        .with({ status: 'PLAYING', death: null }, () => ({
          ...state.player,
          statuses: { ...state.player.statuses, isJumpQueued: true },
        }))
        .otherwise(() => state.player),
    }));
