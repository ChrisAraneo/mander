import type { Level, Player } from '@mander/model';
import type { InputState } from '../../../../types/input-state';

export interface PlayerStepIntent {
  level: Level;
  player: Player;
  input: InputState;
  deltaSeconds: number;
  velocityX: number;
  isFacingRight: boolean;
  velocityY: number;
  isGrounded: boolean;
}
