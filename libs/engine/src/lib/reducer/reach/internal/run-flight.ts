import type { Player } from '@mander/model';
import { chain } from '@mander/utils';
import { match } from 'ts-pattern';
import { stepPlayer } from '../../player/step-player';
import { FRAME_SECONDS } from '../consts';
import { isFlightSettled } from './is-flight-settled';
import { isPlayerBelowLevel } from './is-player-below-level';
import { toPlanInput } from './to-plan-input';
import type { Flight } from './types/flight';

export const runFlight = (
  flight: Flight,
  player: Player,
  frame: number,
  states: Player[],
): Player[] =>
  chain(
    stepPlayer(
      flight.level,
      player,
      toPlanInput(flight.plan, frame),
      FRAME_SECONDS,
    ),
  )
    .thru((next) =>
      match({
        hasFallenOut: isPlayerBelowLevel(flight.level, next),
        hasSettled: isFlightSettled(player, next, frame),
      })
        .with({ hasFallenOut: true }, () => states)
        .with({ hasSettled: true }, () => [...states, next])
        .otherwise(() => runFlight(flight, next, frame + 1, [...states, next])),
    )
    .value();
