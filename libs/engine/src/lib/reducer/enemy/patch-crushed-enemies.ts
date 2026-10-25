import { type Enemy } from '@mander/model';
import { filter, map } from 'lodash-es';
import { match } from 'ts-pattern';
import { isArmedBeartrap } from './internal/is-armed-beartrap';
import { isCaughtByBeartrap } from './internal/is-caught-by-beartrap';
import { startEnemyDeath } from './start-enemy-death';

const patchCaughtEnemies = (enemies: Enemy[], traps: Enemy[]): Enemy[] =>
  map(enemies, (enemy) =>
    match(isCaughtByBeartrap(traps, enemy))
      .with(true, () => startEnemyDeath(enemy))
      .otherwise(() => enemy),
  );

export const patchCrushedEnemies = (enemies: Enemy[]): Enemy[] =>
  patchCaughtEnemies(enemies, filter(enemies, isArmedBeartrap));
