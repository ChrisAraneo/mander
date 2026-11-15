import { match } from 'ts-pattern';
import { computeHarmOutcome } from './compute-harm-outcome';
import { createUnharmedOutcome } from './create-unharmed-outcome';
import type { TickHarmOutcome } from './types/tick-harm-outcome';
import type { TickVictims } from './types/tick-victims';

export const computeTickOutcome = ({
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
  gored,
  hits,
  chills,
  isBurned,
  isFrozen,
}: TickVictims): TickHarmOutcome => ({
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
    .otherwise(() => createUnharmedOutcome(state, bounced)),
});
