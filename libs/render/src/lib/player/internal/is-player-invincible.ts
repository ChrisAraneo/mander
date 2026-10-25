import { isAlive } from '@mander/engine';
import type { Player } from '@mander/model';

export const isPlayerInvincible = (player: Player): boolean =>
  player.timers.invincibility > 0 && isAlive(player);
