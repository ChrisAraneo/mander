import type { Enemy, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { createHeldShooterShot } from './create-held-shooter-shot';
import { createShooterShot } from './create-shooter-shot';
import { isArmedShooter } from './is-armed-shooter';
import { patchShooterCooldown } from './patch-shooter-cooldown';
import type { ShooterShot } from './types/shooter-shot';

export const createShooterTickShot = (
  enemy: Enemy,
  player: Player,
  deltaSeconds: number,
): ShooterShot =>
  match(isArmedShooter(enemy, player))
    .with(true, () =>
      createShooterShot(patchShooterCooldown(enemy, deltaSeconds), player),
    )
    .otherwise(() => createHeldShooterShot(enemy));
