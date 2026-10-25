import { type Enemy } from '@mander/model';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';
import { startEnemyDeath } from '../start-enemy-death';
import { isCaughtByBeartrap } from './is-caught-by-beartrap';

export const patchCaughtEnemies = (enemies: Enemy[], traps: Enemy[]): Enemy[] =>
  map(enemies, (enemy) =>
    match(isCaughtByBeartrap(traps, enemy))
      .with(true, () => startEnemyDeath(enemy))
      .otherwise(() => enemy),
  );
