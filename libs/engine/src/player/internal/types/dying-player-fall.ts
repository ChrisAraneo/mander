import type { Player } from '@mander/model';

export interface DyingPlayerFall {
  player: Player;
  death: number;
  deltaSeconds: number;
  velocityY: number;
}
