import type { Player } from '@mander/model';
import { match, P } from 'ts-pattern';
import { nextPlayer } from '../../player/next-player';
import { patchDyingPlayer } from '../../player/patch-dying-player';
import type { GameState } from '../../state/types/game-state';
import { patchPlayerTimers } from './patch-player-timers';

const { number } = P;

export const patchMovedPlayer = (
  state: GameState,
  deltaSeconds: number,
): Player =>
  match(state.player.timers.death)
    .with(number, (death) =>
      patchDyingPlayer(state.level, state.player, death, deltaSeconds),
    )
    .otherwise(() =>
      patchPlayerTimers(
        nextPlayer(state.level, state.player, state.input, deltaSeconds),
        deltaSeconds,
      ),
    );
