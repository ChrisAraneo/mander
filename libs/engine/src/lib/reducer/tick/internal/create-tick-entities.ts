import { type Point } from '@mander/model';
import { filter, includes } from 'lodash-es';
import { match } from 'ts-pattern';
import { patchCrushedEnemies } from '../../enemy/patch-crushed-enemies';
import { filterLeftBehind } from './filter-left-behind';
import type { TickEntities } from './types/tick-entities';
import type { TickVolley } from './types/tick-volley';

export const createTickEntities = (
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
    bullets,
    shot,
    unshot,
    level,
  }: TickVolley,
  canReach: boolean,
): TickEntities => ({
  state,
  deltaSeconds,
  cannons,
  fireballs,
  player,
  deaths,
  status,
  bullets,
  unshot,
  level,
  enemies: patchCrushedEnemies(shot),
  cannonballs: filter(flying, (cannonball) => !includes(hits, cannonball)),
  canReach,
  gems: match(canReach)
    .with(true, () => filterLeftBehind(player, state.gems))
    .otherwise((): Point[] => state.gems),
});
