import type { Enemy, Player } from '@mander/model';
import { SHOOTER_RELOAD_SECONDS } from '../consts';
import { createShotCannonball } from './create-shot-cannonball';
import type { ShooterShot } from './types/shooter-shot';

export const createFiredShooterShot = (
  shooter: Enemy,
  player: Player,
): ShooterShot => ({
  enemy: {
    ...shooter,
    timers: {
      ...shooter.timers,
      reload: shooter.timers.reload + SHOOTER_RELOAD_SECONDS,
    },
  },
  cannonball: createShotCannonball(shooter, player),
});
