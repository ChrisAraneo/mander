import { type Cannonball, type Enemy, type Snowball } from '@mander/model';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { filterStrikingCannonballs } from '../../cannon/filter-striking-cannonballs';
import { isBurning } from '../../fireball/is-burning';
import { patchChilledPlayer } from '../../player/patch-chilled-player';
import { filterChillingSnowballs } from '../../snowball/filter-chilling-snowballs';
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
  snowballs,
  fallingSpikes,
  fireballs,
  flyingBullets,
  bounced,
  afterStomps,
}: TickStomps): TickHarm =>
  pipe(
    {
      gored: match(isPlayerAlive)
        .with(true, () => filterHornedVictims(bounced, afterStomps))
        .otherwise((): Enemy[] => []),
      hits: match(isPlayerAlive)
        .with(true, () => filterStrikingCannonballs(bounced, flying))
        .otherwise((): Cannonball[] => []),
      chills: match(isPlayerAlive)
        .with(true, () => filterChillingSnowballs(bounced, snowballs))
        .otherwise((): Snowball[] => []),
      isBurned: isPlayerAlive && isBurning(bounced, fireballs),
    },
    ({ gored, hits, chills, isBurned }) => ({
      gored,
      hits,
      chills,
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
    }),
    ({ gored, hits, chills, outcome }): TickHarm => ({
      state,
      deltaSeconds,
      cannons,
      flying,
      snowballs,
      fallingSpikes,
      fireballs,
      flyingBullets,
      afterStomps,
      gored,
      hits,
      chills,
      player: patchChilledPlayer(outcome.player, chills),
      deaths: outcome.deaths,
      status: outcome.status,
    }),
  );
