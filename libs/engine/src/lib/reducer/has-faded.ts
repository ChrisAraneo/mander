import { match, P } from 'ts-pattern';

import type { Enemy } from '../state';
import { ENEMY_DEATH_SECONDS } from '../state';

export const hasFaded = (enemy: Enemy): boolean =>
  match(enemy.dyingFor)
    .with(P.number, (dyingFor) => dyingFor >= ENEMY_DEATH_SECONDS)
    .otherwise(() => false);
