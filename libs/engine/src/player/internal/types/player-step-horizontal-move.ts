import type { Level, Player } from '@mander/model';

export interface PlayerStepHorizontalMove {
  level: Level;
  player: Player;
  deltaSeconds: number;
  isFacingRight: boolean;
  velocityY: number;
  isGrounded: boolean;
  nextX: number;
  blockedVelocityX: number;
}
