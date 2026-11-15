import type { Cannonball, Enemy, Snowball } from '@mander/model';
import { match } from 'ts-pattern';
import { filterStrikingCannonballs } from '../../cannon/filter-striking-cannonballs';
import { isBurning } from '../../fireball/is-burning';
import { isFreezing } from '../../fireball/is-freezing';
import { filterChillingSnowballs } from '../../snowball/filter-chilling-snowballs';
import { filterHornedVictims } from './filter-horned-victims';
import type { TickStomps } from './types/tick-stomps';
import type { TickVictims } from './types/tick-victims';

export const computeTickVictims = ({
  state,
  deltaSeconds,
  isPlayerAlive,
  cannons,
  cannonballs,
  snowballs,
  fallingSpikes,
  fireballs,
  flyingBullets,
  bounced,
  afterStomps,
}: TickStomps): TickVictims => ({
  state,
  deltaSeconds,
  isPlayerAlive,
  cannons,
  cannonballs,
  snowballs,
  fallingSpikes,
  fireballs,
  flyingBullets,
  bounced,
  afterStomps,
  gored: match(isPlayerAlive)
    .with(true, () => filterHornedVictims(bounced, afterStomps))
    .otherwise((): Enemy[] => []),
  hits: match(isPlayerAlive)
    .with(true, () => filterStrikingCannonballs(bounced, cannonballs))
    .otherwise((): Cannonball[] => []),
  chills: match(isPlayerAlive)
    .with(true, () => filterChillingSnowballs(bounced, snowballs))
    .otherwise((): Snowball[] => []),
  isBurned: isPlayerAlive && isBurning(bounced, fireballs),
  isFrozen: isPlayerAlive && isFreezing(bounced, fireballs),
});
