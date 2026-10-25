import { type Player } from '@mander/model';
import { match } from 'ts-pattern';
import { nextPlayer } from '../../player/next-player';
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
  match(
    nextPlayer(
      flight.level,
      player,
      toPlanInput(flight.plan, frame),
      FRAME_SECONDS,
    ),
  )
    .when(
      (next) => isPlayerBelowLevel(flight.level, next),
      () => states,
    )
    .when(
      (next) => isFlightSettled(player, next, frame),
      (next) => [...states, next],
    )
    .otherwise((next) => runFlight(flight, next, frame + 1, [...states, next]));
