import type { Volley } from '../../bullet/types/volley';
import type { TickHarm } from './types/tick-harm';
import type { TickVolley } from './types/tick-volley';

export const createTickVolley = (
  {
    state,
    deltaSeconds,
    cannons,
    flying,
    snowballs,
    fireballs,
    hits,
    chills,
    player,
    deaths,
    status,
  }: TickHarm,
  { bullets, enemies, fallingSpikes, level }: Volley,
): TickVolley => ({
  state,
  deltaSeconds,
  cannons,
  flying,
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
