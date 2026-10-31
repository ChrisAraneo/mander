import type { TickBounce } from './types/tick-bounce';
import type { TickHazards } from './types/tick-hazards';
import type { TickStomps } from './types/tick-stomps';

export const createTickStomps = (
  {
    state,
    deltaSeconds,
    isPlayerAlive,
    cannons,
    flying,
    snowballs,
    fallingSpikes,
    fireballs,
    flyingBullets,
  }: TickHazards,
  { player, enemies }: TickBounce,
): TickStomps => ({
  state,
  deltaSeconds,
  isPlayerAlive,
  cannons,
  flying,
  snowballs,
  fallingSpikes,
  fireballs,
  flyingBullets,
  bounced: player,
  afterStomps: enemies,
});
