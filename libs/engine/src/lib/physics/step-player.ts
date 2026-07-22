import type { Level } from '@mander/generator';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../state';
import type { InputState, Player, PlayerCapabilities } from '../state';
import { GRAVITY, MAX_TICK_SECONDS, TERMINAL_VELOCITY } from './constants';
import { moveHorizontal } from './move-horizontal';
import { moveVertical } from './move-vertical';

const JUMP_CUT_GRAVITY_FACTOR = 2.6;

export function stepPlayer(
  level: Level,
  player: Player,
  input: InputState,
  capabilities: PlayerCapabilities,
  elapsedSeconds: number
): Player {
  const deltaSeconds = Math.min(elapsedSeconds, MAX_TICK_SECONDS);
  const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);

  let { vy, grounded } = player;
  const vx = direction * capabilities.moveSpeed;
  const facing = direction !== 0 ? (direction as 1 | -1) : player.facing;

  if ((player.jumpQueued || input.jump) && grounded) {
    vy = -capabilities.jumpVelocity;
    grounded = false;
  }

  const gravity = vy < 0 && !input.jump ? GRAVITY * JUMP_CUT_GRAVITY_FACTOR : GRAVITY;
  vy = Math.min(vy + gravity * deltaSeconds, TERMINAL_VELOCITY);

  const horizontal = moveHorizontal(level, player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT, vx * deltaSeconds);
  const nextX = horizontal.position;

  const vertical = moveVertical(level, nextX, player.y, PLAYER_WIDTH, PLAYER_HEIGHT, vy * deltaSeconds);
  const nextY = vertical.position;
  if (vertical.isBlocked) {
    if (vy > 0) {
      grounded = true;
    }
    vy = 0;
  } else if (vy > 0) {
    grounded = false;
  }

  return {
    x: nextX,
    y: nextY,
    vx: horizontal.isBlocked ? 0 : vx,
    vy,
    grounded,
    facing,
    jumpQueued: false,
  };
}
