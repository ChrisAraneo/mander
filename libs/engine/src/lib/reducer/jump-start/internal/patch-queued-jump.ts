import type { Player } from '@mander/model';
import { match } from 'ts-pattern';
import { patchInput } from '../../../state/patch-input';
import type { GameState } from '../../../types/game-state';

export const patchQueuedJump = (state: GameState): GameState => ({
  ...patchInput(state, { isJump: true }),
  player: match({
    status: state.status,
    death: state.player.timers.death,
  })
    .with({ status: 'PLAYING', death: null }, (): Player => ({
      ...state.player,
      statuses: { ...state.player.statuses, isJumpQueued: true },
    }))
    .otherwise(() => state.player),
});
