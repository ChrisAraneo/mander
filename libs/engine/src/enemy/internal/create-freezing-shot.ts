import type { Enemy, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { createFiredFreezingShot } from './create-fired-freezing-shot';
import { createHeldFreezingShot } from './create-held-freezing-shot';
import type { FreezingShot } from './types/freezing-shot';

export const createFreezingShot = (
  freezer: Enemy,
  player: Player,
): FreezingShot =>
  match(freezer.timers.reload <= 0)
    .with(true, () => createFiredFreezingShot(freezer, player))
    .otherwise(() => createHeldFreezingShot(freezer));
