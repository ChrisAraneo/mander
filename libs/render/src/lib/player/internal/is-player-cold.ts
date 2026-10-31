import { isAlive, isCold } from '@mander/engine';
import type { Player } from '@mander/model';

export const isPlayerCold = (player: Player): boolean =>
  isCold(player) && isAlive(player);
