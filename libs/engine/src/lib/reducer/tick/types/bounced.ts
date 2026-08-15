import type { Enemy, Player } from '@mander/model';

export interface Bounced {
  player: Player;
  enemies: Enemy[];
}
