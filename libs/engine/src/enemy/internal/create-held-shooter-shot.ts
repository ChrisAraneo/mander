import type { Enemy } from '@mander/model';
import type { ShooterShot } from './types/shooter-shot';

export const createHeldShooterShot = (shooter: Enemy): ShooterShot => ({
  enemy: shooter,
  cannonball: undefined,
});
