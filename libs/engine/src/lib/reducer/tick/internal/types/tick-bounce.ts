import type { Enemy, Player } from '@mander/model';

export interface TickBounce {
  player: Player;
  enemies: Enemy[];
}
