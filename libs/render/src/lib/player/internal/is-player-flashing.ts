import { isAlive } from '@mander/engine';
import type { Player } from '@mander/model';

export const isPlayerFlashing = (player: Player): boolean =>
  player.timers.hurt > 0 && isAlive(player);
