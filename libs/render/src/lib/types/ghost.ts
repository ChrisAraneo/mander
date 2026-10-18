import type { Player } from '@mander/model';

export interface Ghost {
  player: Player;
  time: number;
}
