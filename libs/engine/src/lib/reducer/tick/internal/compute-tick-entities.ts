import { chain, type Point } from '@mander/model';
import { filter, includes } from 'lodash-es';
import { match } from 'ts-pattern';
import { crushEnemies } from '../../enemy/crush-enemies';
import { isAlive } from '../../player/is-alive';
import { filterLeftBehind } from './filter-left-behind';
import type { TickEntities } from './types/tick-entities';
import type { TickVolley } from './types/tick-volley';

export const computeTickEntities = ({
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
}: TickVolley): TickEntities =>
  chain({
    enemies: crushEnemies(shot),
    cannonballs: filter(flying, (cannonball) => !includes(hits, cannonball)),
    canReach: isAlive(player),
  })
    .thru(({ enemies, cannonballs, canReach }): TickEntities => ({
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
      enemies,
      cannonballs,
      canReach,
      gems: match(canReach)
        .with(true, () => filterLeftBehind(player, state.gems))
        .otherwise((): Point[] => state.gems),
    }))
    .value();
