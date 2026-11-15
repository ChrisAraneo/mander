import type { Enemy, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { createFiredShooterShot } from './create-fired-shooter-shot';
import { createHeldShooterShot } from './create-held-shooter-shot';
import type { ShooterShot } from './types/shooter-shot';

export const createShooterShot = (
  shooter: Enemy,
  player: Player,
): ShooterShot =>
  match(shooter.timers.reload <= 0)
    .with(true, () => createFiredShooterShot(shooter, player))
    .otherwise(() => createHeldShooterShot(shooter));
