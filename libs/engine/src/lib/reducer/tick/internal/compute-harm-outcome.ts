import type { Cannonball, Enemy, FallingSpike, Player } from '@mander/model';
import { match } from 'ts-pattern';
import type { GameState } from '../../../types/game-state';
import { createGameOverOutcome } from './create-game-over-outcome';
import { createPitOutcome } from './create-pit-outcome';
import { isPlayerInPit } from './is-player-in-pit';
import { isTouchingHazard } from './is-touching-hazard';
import { patchHurtPlayer } from './patch-hurt-player';
import type { TickOutcome } from './types/tick-outcome';

export const computeHarmOutcome = (
  state: GameState,
  player: Player,
  enemies: Enemy[],
  fallingSpikes: FallingSpike[],
  hits: Cannonball[],
  isBurned: boolean,
): TickOutcome =>
  match({
    hasFallenIntoPit: isPlayerInPit(state.level, player),
    isStruck:
      player.timers.invincibility <= 0 &&
      isTouchingHazard(state, player, enemies, fallingSpikes, hits, isBurned),
    canSurvive: player.hearts.value > 1,
  })
    .with({ hasFallenIntoPit: true, canSurvive: true }, () =>
      createPitOutcome(state, player),
    )
    .with({ hasFallenIntoPit: true }, () =>
      createGameOverOutcome(state, player),
    )
    .with({ isStruck: true, canSurvive: true }, (): TickOutcome => ({
      player: patchHurtPlayer(player),
      deaths: state.deaths,
      status: 'PLAYING',
    }))
    .with({ isStruck: true }, () => createGameOverOutcome(state, player))
    .otherwise((): TickOutcome => ({
      player,
      deaths: state.deaths,
      status: 'PLAYING',
    }));
