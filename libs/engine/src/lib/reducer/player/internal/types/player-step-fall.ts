import type { Level, Player } from '@mander/model';

export interface PlayerStepFall {
  level: Level;
  player: Player;
  deltaSeconds: number;
  velocityX: number;
  isFacingRight: boolean;
  velocityY: number;
  isGrounded: boolean;
}
