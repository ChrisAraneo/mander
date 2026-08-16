import { match, P } from 'ts-pattern';

import type { Enemy } from '@mander/model';
import { ENEMY_DEATH_SECONDS } from './consts';

const { number } = P;

export const hasFaded = (enemy: Enemy): boolean =>
  match(enemy.timers.death)
    .with(number, (death) => death >= ENEMY_DEATH_SECONDS)
    .otherwise(() => false);
