import type { Level } from '@mander/generator';
import { chain } from 'lodash-es';
import { match } from 'ts-pattern';

import type { InputState, Player, PlayerCapabilities } from '../state';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../state';
import { GRAVITY, MAX_TICK_SECONDS, TERMINAL_VELOCITY } from './constants';
import { resolveLanding } from './landing';
import { moveHorizontal } from './move-horizontal';
import { moveVertical } from './move-vertical';

const JUMP_CUT_GRAVITY_FACTOR = 2.6;

const horizontalDirection = (input: InputState): number =>
  match(input)
    .with({ isRight: true, isLeft: false }, () => 1)
    .with({ isRight: false, isLeft: true }, () => -1)
    .otherwise(() => 0);

const facingFor = (direction: number, current: 1 | -1): 1 | -1 =>
  match(direction)
    .with(0, () => current)
    .otherwise((): 1 | -1 => {
      if (direction < 0) return -1;
      return 1;
    });

const afterJump = (
  base: { vy: number; isGrounded: boolean },
  input: InputState,
  player: Player,
  capabilities: PlayerCapabilities,
): { vy: number; isGrounded: boolean } =>
  match({
    shouldJump: player.isJumpQueued || input.isJump,
    isGrounded: base.isGrounded,
  })
    .with({ shouldJump: true, isGrounded: true }, () => ({
      vy: -capabilities.jumpVelocity,
      isGrounded: false,
    }))
    .otherwise(() => base);

const gravityFor = (vy: number, input: InputState): number =>
  match(vy < 0 && !input.isJump)
    .with(true, () => GRAVITY * JUMP_CUT_GRAVITY_FACTOR)
    .otherwise(() => GRAVITY);

const blockedVx = (isBlocked: boolean, vx: number): number =>
  match(isBlocked)
    .with(true, () => 0)
    .otherwise(() => vx);

const playerIntent = (
  player: Player,
  input: InputState,
  capabilities: PlayerCapabilities,
  deltaSeconds: number,
) =>
  chain({
    deltaSeconds,
    direction: horizontalDirection(input),
  })
    .thru((s) => ({
      ...s,
      vx: s.direction * capabilities.moveSpeed,
      facing: facingFor(s.direction, player.facing),
      ...afterJump(
        { vy: player.vy, isGrounded: player.isGrounded },
        input,
        player,
        capabilities,
      ),
    }))
    .thru((s) => ({
      ...s,
      vy: Math.min(
        s.vy + gravityFor(s.vy, input) * s.deltaSeconds,
        TERMINAL_VELOCITY,
      ),
    }))
    .value();

const resolvePlayer = (
  level: Level,
  player: Player,
  intent: ReturnType<typeof playerIntent>,
): Player =>
  chain(intent)
    .thru((s) => ({
      ...s,
      horizontal: moveHorizontal(
        level,
        player.x,
        player.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
        s.vx * s.deltaSeconds,
      ),
    }))
    .thru((s) => ({
      ...s,
      nextX: s.horizontal.position,
      vxOut: blockedVx(s.horizontal.isBlocked, s.vx),
    }))
    .thru((s) => ({
      ...s,
      vertical: moveVertical(
        level,
        s.nextX,
        player.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
        s.vy * s.deltaSeconds,
      ),
    }))
    .thru((s) => ({
      ...s,
      nextY: s.vertical.position,
      ...resolveLanding(s.vertical.isBlocked, s.vy > 0, s.isGrounded, s.vy),
    }))
    .thru((s): Player => ({
      x: s.nextX,
      y: s.nextY,
      vx: s.vxOut,
      vy: s.vy,
      isGrounded: s.isGrounded,
      facing: s.facing,
      isJumpQueued: false,
    }))
    .value();

export const stepPlayer = (
  level: Level,
  player: Player,
  input: InputState,
  capabilities: PlayerCapabilities,
  elapsedSeconds: number,
): Player => {
  const deltaSeconds = Math.min(elapsedSeconds, MAX_TICK_SECONDS);
  const intent = playerIntent(player, input, capabilities, deltaSeconds);
  return resolvePlayer(level, player, intent);
};
