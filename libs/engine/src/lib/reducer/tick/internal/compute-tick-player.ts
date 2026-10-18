import { chain } from '@mander/model';
import { isNull } from 'lodash-es';
import type { GameState } from '../../../types/game-state';
import { isAlive } from '../../player/is-alive';
import { patchMovedPlayer } from './patch-moved-player';
import type { TickPlayer } from './types/tick-player';

export const computeTickPlayer = ({
  state,
  deltaSeconds,
}: {
  state: GameState;
  deltaSeconds: number;
}): TickPlayer =>
  chain(patchMovedPlayer(state, deltaSeconds))
    .thru((moved): TickPlayer => ({
      state,
      deltaSeconds,
      moved,
      hasRespawned:
        !isNull(state.player.timers.death) && isNull(moved.timers.death),
      isPlayerAlive: isAlive(moved),
    }))
    .value();
