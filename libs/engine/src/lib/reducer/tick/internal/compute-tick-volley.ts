import { computeVolley } from '../../bullet/compute-volley';
import type { Volley } from '../../bullet/types/volley';
import { patchStruckEnemies } from './patch-struck-enemies';
import type { TickHarm } from './types/tick-harm';
import type { TickVolley } from './types/tick-volley';

const computeHarmVolley = ({
  state,
  fallingSpikes,
  flyingBullets,
  afterStomps,
  gored,
}: TickHarm): Volley =>
  computeVolley(
    flyingBullets,
    patchStruckEnemies(afterStomps, gored),
    fallingSpikes,
    state.level,
  );

const createTickVolley = (
  {
    state,
    deltaSeconds,
    cannons,
    flying,
    fireballs,
    hits,
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
  fireballs,
  hits,
  player,
  deaths,
  status,
  bullets,
  shot: enemies,
  unshot: fallingSpikes,
  level,
});

export const computeTickVolley = (harm: TickHarm): TickVolley =>
  createTickVolley(harm, computeHarmVolley(harm));
