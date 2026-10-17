import type { Player } from '@mander/model';
import { STAR_INVINCIBLE_SECONDS } from '../../player/consts';

export const patchShieldedPlayer = (player: Player): Player => ({
  ...player,
  timers: {
    ...player.timers,
    invincibility: Math.max(
      player.timers.invincibility,
      STAR_INVINCIBLE_SECONDS,
    ),
    star: Math.max(player.timers.star, STAR_INVINCIBLE_SECONDS),
  },
});
