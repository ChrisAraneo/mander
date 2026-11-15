import type { Enemy } from '@mander/model';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';
import { startEnemyDeath } from '../../enemy/start-enemy-death';
import type { Volley } from '../types/volley';

export const patchVolleyVictim = (volley: Volley, victim: Enemy): Volley => ({
  ...volley,
  enemies: map(volley.enemies, (enemy) =>
    match(enemy === victim)
      .with(true, () => startEnemyDeath(enemy))
      .otherwise(() => enemy),
  ),
});
