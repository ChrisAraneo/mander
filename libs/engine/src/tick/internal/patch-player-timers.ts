import type { Player } from '@mander/model';

export const patchPlayerTimers = (
  player: Player,
  deltaSeconds: number,
): Player => ({
  ...player,
  timers: {
    ...player.timers,
    invincibility: Math.max(0, player.timers.invincibility - deltaSeconds),
    star: Math.max(0, player.timers.star - deltaSeconds),
    hurt: Math.max(0, player.timers.hurt - deltaSeconds),
    cold: Math.max(0, player.timers.cold - deltaSeconds),
  },
});
