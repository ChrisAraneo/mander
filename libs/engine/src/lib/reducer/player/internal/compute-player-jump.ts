import type { Player } from '@mander/model';
import { match } from 'ts-pattern';
import type { InputState } from '../../../types/input-state';
import { getPlayerJumpVelocity } from '../get-player-jump-velocity';
import type { PlayerJump } from './types/player-jump';

export const computePlayerJump = (
  base: PlayerJump,
  input: InputState,
  player: Player,
): PlayerJump =>
  match({
    shouldJump: player.statuses.isJumpQueued || input.isJump,
    isGrounded: base.isGrounded,
  })
    .with({ shouldJump: true, isGrounded: true }, (): PlayerJump => ({
      velocityY: -getPlayerJumpVelocity(player),
      isGrounded: false,
    }))
    .otherwise(() => base);
