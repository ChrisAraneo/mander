import type { Cannonball, Enemy } from '@mander/model';
import { chain } from '@mander/utils';
import { match } from 'ts-pattern';
import { filterStrikingCannonballs } from '../../cannon/filter-striking-cannonballs';
import { isBurning } from '../../fireball/is-burning';
import { computeHarmOutcome } from './compute-harm-outcome';
import { filterHornedVictims } from './filter-horned-victims';
import type { TickHarm } from './types/tick-harm';
import type { TickOutcome } from './types/tick-outcome';
import type { TickStomps } from './types/tick-stomps';

export const computeTickHarm = ({
  state,
  deltaSeconds,
  isPlayerAlive,
  cannons,
  flying,
  fallingSpikes,
  fireballs,
  playerFireballs,
  flyingBullets,
  bounced,
  afterStomps,
}: TickStomps): TickHarm =>
  chain({
    gored: match(isPlayerAlive)
      .with(true, () => filterHornedVictims(bounced, afterStomps))
      .otherwise((): Enemy[] => []),
    hits: match(isPlayerAlive)
      .with(true, () => filterStrikingCannonballs(bounced, flying))
      .otherwise((): Cannonball[] => []),
    isBurned: isPlayerAlive && isBurning(bounced, fireballs),
  })
    .thru(({ gored, hits, isBurned }) => ({
      gored,
      hits,
      outcome: match(isPlayerAlive)
        .with(true, () =>
          computeHarmOutcome(
            state,
            bounced,
            afterStomps,
            fallingSpikes,
            hits,
            isBurned,
          ),
        )
        .otherwise((): TickOutcome => ({
          player: bounced,
          deaths: state.deaths,
          status: 'PLAYING',
        })),
    }))
    .thru(({ gored, hits, outcome }): TickHarm => ({
      state,
      deltaSeconds,
      isPlayerAlive,
      cannons,
      flying,
      fallingSpikes,
      fireballs,
      playerFireballs,
      flyingBullets,
      afterStomps,
      gored,
      hits,
      player: outcome.player,
      deaths: outcome.deaths,
      status: outcome.status,
    }))
    .value();
