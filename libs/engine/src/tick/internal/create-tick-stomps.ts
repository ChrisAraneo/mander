import type { CarriedHazards } from './types/carried-hazards';
import type { TickBounce } from './types/tick-bounce';
import type { TickStomps } from './types/tick-stomps';

export const createTickStomps = (
  {
    state,
    deltaSeconds,
    isPlayerAlive,
    cannons,
    cannonballs,
    snowballs,
    fallingSpikes,
    fireballs,
    flyingBullets,
  }: CarriedHazards,
  { player, enemies }: TickBounce,
): TickStomps => ({
  state,
  deltaSeconds,
  isPlayerAlive,
  cannons,
  cannonballs,
  snowballs,
  fallingSpikes,
  fireballs,
  flyingBullets,
  bounced: player,
  afterStomps: enemies,
});
