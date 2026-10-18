import type { Cannon } from '@mander/model';

export const patchCannonCooldown = (
  cannon: Cannon,
  deltaSeconds: number,
): Cannon => ({
  ...cannon,
  timers: { reload: cannon.timers.reload - deltaSeconds },
});
