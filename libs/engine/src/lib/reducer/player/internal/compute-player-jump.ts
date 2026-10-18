import type { Player } from '@mander/model';
import { match } from 'ts-pattern';
import type { InputState } from '../../../types/input-state';
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
      velocityY: -player.velocity.y.max,
      isGrounded: false,
    }))
    .otherwise(() => base);
