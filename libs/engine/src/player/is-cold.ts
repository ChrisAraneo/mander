import type { Player } from '@mander/model';

export const isCold = (player: Player): boolean => player.timers.cold > 0;
