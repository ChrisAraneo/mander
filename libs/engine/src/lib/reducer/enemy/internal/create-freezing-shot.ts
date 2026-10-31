import type { Enemy, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { FREEZING_RELOAD_SECONDS } from '../consts';
import { createHeldFreezingShot } from './create-held-freezing-shot';
import { createShotSnowball } from './create-shot-snowball';
import type { FreezingShot } from './types/freezing-shot';

export const createFreezingShot = (
  freezer: Enemy,
  player: Player,
): FreezingShot =>
  match(freezer.timers.reload <= 0)
    .with(true, (): FreezingShot => ({
      enemy: {
        ...freezer,
        timers: {
          ...freezer.timers,
          reload: freezer.timers.reload + FREEZING_RELOAD_SECONDS,
        },
      },
      snowball: createShotSnowball(freezer, player),
    }))
    .otherwise(() => createHeldFreezingShot(freezer));
