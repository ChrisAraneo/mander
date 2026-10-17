import type { Enemy, Level } from '@mander/model';
import { chain } from '@mander/utils';
import { patchDyingEnemy } from './patch-dying-enemy';

export const patchFadingEnemy = (
  level: Level,
  enemy: Enemy,
  death: number,
  deltaSeconds: number,
): Enemy =>
  chain(patchDyingEnemy(level, enemy, deltaSeconds))
    .thru((fallen): Enemy => ({
      ...fallen,
      timers: { ...fallen.timers, death: death + deltaSeconds },
    }))
    .value();
