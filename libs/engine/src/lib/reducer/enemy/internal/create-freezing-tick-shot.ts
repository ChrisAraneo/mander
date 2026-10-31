import type { Enemy, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { createFreezingShot } from './create-freezing-shot';
import { createHeldFreezingShot } from './create-held-freezing-shot';
import { isArmedFreezing } from './is-armed-freezing';
import { patchShooterCooldown } from './patch-shooter-cooldown';
import type { FreezingShot } from './types/freezing-shot';

export const createFreezingTickShot = (
  enemy: Enemy,
  player: Player,
  deltaSeconds: number,
): FreezingShot =>
  match(isArmedFreezing(enemy, player))
    .with(true, () =>
      createFreezingShot(patchShooterCooldown(enemy, deltaSeconds), player),
    )
    .otherwise(() => createHeldFreezingShot(enemy));
