import { match, P } from 'ts-pattern';

import type { Enemy } from '@mander/model';
import { ENEMY_DEATH_SECONDS } from './consts';

export const hasFaded = (enemy: Enemy): boolean =>
  match(enemy.timers.death)
    .with(P.number, (death) => death >= ENEMY_DEATH_SECONDS)
    .otherwise(() => false);
