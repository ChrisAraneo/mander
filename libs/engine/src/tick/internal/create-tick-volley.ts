import type { Volley } from '../../bullet/types/volley';
import type { CarriedHarm } from './types/carried-harm';
import type { TickVolley } from './types/tick-volley';

export const createTickVolley = (
  {
    state,
    deltaSeconds,
    cannons,
    cannonballs,
    snowballs,
    fireballs,
    hits,
    chills,
    player,
    deaths,
    status,
  }: CarriedHarm,
  { bullets, enemies, fallingSpikes, level }: Volley,
): TickVolley => ({
  state,
  deltaSeconds,
  cannons,
  cannonballs,
  snowballs,
  fireballs,
  hits,
  chills,
  player,
  deaths,
  status,
  bullets,
  shot: enemies,
  unshot: fallingSpikes,
  level,
});
