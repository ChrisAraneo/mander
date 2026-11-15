import type { Enemy, Player } from '@mander/model';
import { FREEZING_RELOAD_SECONDS } from '../consts';
import { createShotSnowball } from './create-shot-snowball';
import type { FreezingShot } from './types/freezing-shot';

export const createFiredFreezingShot = (
  freezer: Enemy,
  player: Player,
): FreezingShot => ({
  enemy: {
    ...freezer,
    timers: {
      ...freezer.timers,
      reload: freezer.timers.reload + FREEZING_RELOAD_SECONDS,
    },
  },
  snowball: createShotSnowball(freezer, player),
});
