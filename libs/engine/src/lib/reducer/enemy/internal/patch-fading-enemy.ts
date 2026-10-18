import { type Enemy, type Level, chain } from '@mander/model';
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
