import type { Player } from '@mander/model';

export interface PlayerStepVerticalMove {
  player: Player;
  isFacingRight: boolean;
  nextX: number;
  blockedVelocityX: number;
  nextY: number;
  velocityY: number;
  isGrounded: boolean;
}
