import { patchColdTickPlayer } from './patch-cold-tick-player';
import type { TickHarm } from './types/tick-harm';
import type { TickHarmOutcome } from './types/tick-harm-outcome';

export const createTickHarm = ({
  state,
  deltaSeconds,
  cannons,
  cannonballs,
  snowballs,
  fallingSpikes,
  fireballs,
  flyingBullets,
  afterStomps,
  gored,
  hits,
  chills,
  isFrozen,
  outcome,
}: TickHarmOutcome): TickHarm => ({
  state,
  deltaSeconds,
  cannons,
  cannonballs,
  snowballs,
  fallingSpikes,
  fireballs,
  flyingBullets,
  afterStomps,
  gored,
  hits,
  chills,
  player: patchColdTickPlayer(outcome.player, chills, isFrozen),
  deaths: outcome.deaths,
  status: outcome.status,
});
