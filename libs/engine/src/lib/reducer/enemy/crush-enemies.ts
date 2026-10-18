import { type Enemy, chain } from '@mander/model';
import { filter, map } from 'lodash-es';
import { match } from 'ts-pattern';
import { isArmedBeartrap } from './internal/is-armed-beartrap';
import { isCaughtByBeartrap } from './internal/is-caught-by-beartrap';
import { startEnemyDeath } from './start-enemy-death';

export const crushEnemies = (enemies: Enemy[]): Enemy[] =>
  chain(filter(enemies, isArmedBeartrap))
    .thru((traps) =>
      map(enemies, (enemy) =>
        match(isCaughtByBeartrap(traps, enemy))
          .with(true, () => startEnemyDeath(enemy))
          .otherwise(() => enemy),
      ),
    )
    .value();
