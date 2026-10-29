import type { Enemy } from '@mander/model';

export const patchShooterCooldown = (
  shooter: Enemy,
  deltaSeconds: number,
): Enemy => ({
  ...shooter,
  timers: { ...shooter.timers, reload: shooter.timers.reload - deltaSeconds },
});
