import type { Enemy, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { SHOOTER_RELOAD_SECONDS } from '../consts';
import { createHeldShooterShot } from './create-held-shooter-shot';
import { createShotCannonball } from './create-shot-cannonball';
import type { ShooterShot } from './types/shooter-shot';

export const createShooterShot = (
  shooter: Enemy,
  player: Player,
): ShooterShot =>
  match(shooter.timers.reload <= 0)
    .with(true, (): ShooterShot => ({
      enemy: {
        ...shooter,
        timers: {
          ...shooter.timers,
          reload: shooter.timers.reload + SHOOTER_RELOAD_SECONDS,
        },
      },
      cannonball: createShotCannonball(shooter, player),
    }))
    .otherwise(() => createHeldShooterShot(shooter));
