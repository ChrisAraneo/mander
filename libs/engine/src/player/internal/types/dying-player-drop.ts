import type { Player } from '@mander/model';

export interface DyingPlayerDrop {
  player: Player;
  death: number;
  deltaSeconds: number;
  velocityY: number;
  positionY: number;
}
