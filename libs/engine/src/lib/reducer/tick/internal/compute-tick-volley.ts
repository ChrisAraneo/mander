import { chain } from '@mander/model';
import { resolveVolley } from '../../bullet/resolve-volley';
import { patchStruckEnemies } from './patch-struck-enemies';
import type { TickHarm } from './types/tick-harm';
import type { TickVolley } from './types/tick-volley';

export const computeTickVolley = ({
  state,
  deltaSeconds,
  cannons,
  flying,
  fallingSpikes,
  fireballs,
  flyingBullets,
  afterStomps,
  gored,
  hits,
  player,
  deaths,
  status,
}: TickHarm): TickVolley =>
  chain(
    resolveVolley(
      flyingBullets,
      patchStruckEnemies(afterStomps, gored),
      fallingSpikes,
      state.level,
    ),
  )
    .thru((volley): TickVolley => ({
      state,
      deltaSeconds,
      cannons,
      flying,
      fireballs,
      hits,
      player,
      deaths,
      status,
      bullets: volley.bullets,
      shot: volley.enemies,
      unshot: volley.fallingSpikes,
      level: volley.level,
    }))
    .value();
