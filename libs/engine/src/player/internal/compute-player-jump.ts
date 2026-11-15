import type { Player } from '@mander/model';
import { match } from 'ts-pattern';
import type { InputState } from '../../state/types/input-state';
import { getPlayerJumpVelocity } from '../get-player-jump-velocity';
import type { PlayerJump } from './types/player-jump';

export const computePlayerJump = (
  base: PlayerJump,
  player: Player,
  input: InputState,
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
