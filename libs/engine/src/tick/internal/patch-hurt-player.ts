import type { Player } from '@mander/model';
import {
  HURT_FLASH_SECONDS,
  HURT_INVINCIBLE_SECONDS,
} from '../../player/consts';
import { patchLostHeart } from './patch-lost-heart';

export const patchHurtPlayer = (player: Player): Player => ({
  ...player,
  hearts: patchLostHeart(player.hearts),
  timers: {
    ...player.timers,
    invincibility: HURT_INVINCIBLE_SECONDS,
    hurt: HURT_FLASH_SECONDS,
  },
});
