import type { Enemy } from '@mander/model';
import { includes, map } from 'lodash-es';
import { match } from 'ts-pattern';
import { startEnemyDeath } from '../../enemy/start-enemy-death';

export const patchStruckEnemies = (
  enemies: Enemy[],
  victims: Enemy[],
): Enemy[] =>
  map(enemies, (enemy) =>
    match(includes(victims, enemy))
      .with(true, () => startEnemyDeath(enemy))
      .otherwise(() => enemy),
  );
