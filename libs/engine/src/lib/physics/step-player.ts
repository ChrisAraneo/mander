import type { TileMap } from '../world';
import { chain } from '@mander/utils';
import { match } from 'ts-pattern';

import type { InputState, Player } from '../state';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../state';
import { GRAVITY, MAX_TICK_SECONDS, TERMINAL_VELOCITY } from './constants';
import { resolveLanding } from './resolve-landing';
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
    .otherwise((): 1 | -1 =>
      match(direction < 0)
        .with(true, (): 1 | -1 => -1)
        .otherwise((): 1 | -1 => 1),
    );

const afterJump = (
  base: { vy: number; isGrounded: boolean },
  input: InputState,
  player: Player,
): { vy: number; isGrounded: boolean } =>
  match({
    shouldJump: player.isJumpQueued || input.isJump,
    isGrounded: base.isGrounded,
  })
    .with({ shouldJump: true, isGrounded: true }, () => ({
      vy: -player.jumpVelocity,
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
  deltaSeconds: number,
) =>
  chain({
    deltaSeconds,
    direction: horizontalDirection(input),
  })
    .thru((stage) => ({
      ...stage,
      vx: stage.direction * player.moveSpeed,
      facing: facingFor(stage.direction, player.facing),
      ...afterJump(
        { vy: player.vy, isGrounded: player.isGrounded },
        input,
        player,
      ),
    }))
    .thru((stage) => ({
      ...stage,
      vy: Math.min(
        stage.vy + gravityFor(stage.vy, input) * stage.deltaSeconds,
        TERMINAL_VELOCITY,
      ),
    }))
    .value();

const resolvePlayer = (
  level: TileMap,
  player: Player,
  intent: ReturnType<typeof playerIntent>,
): Player =>
  chain(intent)
    .thru((stage) => ({
      ...stage,
      horizontal: moveHorizontal(
        level,
        player.x,
        player.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
        stage.vx * stage.deltaSeconds,
      ),
    }))
    .thru((stage) => ({
      ...stage,
      nextX: stage.horizontal.position,
      vxOut: blockedVx(stage.horizontal.isBlocked, stage.vx),
    }))
    .thru((stage) => ({
      ...stage,
      vertical: moveVertical(
        level,
        stage.nextX,
        player.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
        stage.vy * stage.deltaSeconds,
      ),
    }))
    .thru((stage) => ({
      ...stage,
      nextY: stage.vertical.position,
      ...resolveLanding(
        stage.vertical.isBlocked,
        stage.vy > 0,
        stage.isGrounded,
        stage.vy,
      ),
    }))
    .thru(
      (stage): Player => ({
        x: stage.nextX,
        y: stage.nextY,
        vx: stage.vxOut,
        vy: stage.vy,
        isGrounded: stage.isGrounded,
        facing: stage.facing,
        isJumpQueued: false,
        dyingFor: player.dyingFor,
        hearts: player.hearts,
        invincibleFor: player.invincibleFor,
        moveSpeed: player.moveSpeed,
        jumpVelocity: player.jumpVelocity,
      }),
    )
    .value();

export const stepPlayer = (
  level: TileMap,
  player: Player,
  input: InputState,
  elapsedSeconds: number,
): Player => {
  const deltaSeconds = Math.min(elapsedSeconds, MAX_TICK_SECONDS);
  const intent = playerIntent(player, input, deltaSeconds);
  return resolvePlayer(level, player, intent);
};
