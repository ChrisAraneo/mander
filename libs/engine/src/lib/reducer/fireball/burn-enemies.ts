import { type Enemy, type Fireball } from '@mander/model';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';
import { startEnemyDeath } from '../enemy/start-enemy-death';
import { isEnemyBurned } from './internal/is-enemy-burned';

export const burnEnemies = (
  fireballs: Fireball[],
  enemies: Enemy[],
  elapsedSeconds = 0,
): Enemy[] =>
  map(enemies, (enemy) =>
    match(isEnemyBurned(fireballs, enemy, elapsedSeconds))
      .with(true, () => startEnemyDeath(enemy))
      .otherwise(() => enemy),
  );
