import {
  GRAVITY,
  type Level,
  MAX_TICK_SECONDS,
  type Player,
  TERMINAL_VELOCITY,
} from '@mander/model';
import { chain } from '@mander/utils';
import { match } from 'ts-pattern';

import { moveHorizontal } from '../collision/move-horizontal';
import { moveVertical } from '../collision/move-vertical';
import { resolveLanding } from '../collision/resolve-landing';
import type { InputState } from '../../state/types/input-state';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from './consts';

const JUMP_CUT_GRAVITY_FACTOR = 2.6;

const getHorizontalDirection = (input: InputState): number =>
  match(input)
    .with({ isRight: true, isLeft: false }, () => 1)
    .with({ isRight: false, isLeft: true }, () => -1)
    .otherwise(() => 0);

const isFacingRightFor = (direction: number, isFacingRight: boolean): boolean =>
  match(direction)
    .with(0, () => isFacingRight)
    .otherwise(() => direction > 0);

const applyJump = (
  base: { vy: number; isGrounded: boolean },
  input: InputState,
  player: Player,
): { vy: number; isGrounded: boolean } =>
  match({
    shouldJump: player.statuses.isJumpQueued || input.isJump,
    isGrounded: base.isGrounded,
  })
    .with({ shouldJump: true, isGrounded: true }, () => ({
      vy: -player.velocity.y.max,
      isGrounded: false,
    }))
    .otherwise(() => base);

const getGravity = (vy: number, input: InputState): number =>
  match(vy < 0 && !input.isJump)
    .with(true, () => GRAVITY * JUMP_CUT_GRAVITY_FACTOR)
    .otherwise(() => GRAVITY);

const getBlockedVx = (isBlocked: boolean, vx: number): number =>
  match(isBlocked)
    .with(true, () => 0)
    .otherwise(() => vx);

const getPlayerIntent = (
  player: Player,
  input: InputState,
  deltaSeconds: number,
) =>
  chain({
    deltaSeconds,
    direction: getHorizontalDirection(input),
  })
    .thru((stage) => ({
      ...stage,
      vx: stage.direction * player.velocity.x.max,
      isFacingRight: isFacingRightFor(
        stage.direction,
        player.statuses.isFacingRight,
      ),
      ...applyJump(
        {
          vy: player.velocity.y.current,
          isGrounded: player.statuses.isGrounded,
        },
        input,
        player,
      ),
    }))
    .thru((stage) => ({
      ...stage,
      vy: Math.min(
        stage.vy + getGravity(stage.vy, input) * stage.deltaSeconds,
        TERMINAL_VELOCITY,
      ),
    }))
    .value();

const resolvePlayer = (
  level: Level,
  player: Player,
  intent: ReturnType<typeof getPlayerIntent>,
): Player =>
  chain(intent)
    .thru((stage) => ({
      ...stage,
      horizontal: moveHorizontal(
        level,
        player.position.x,
        player.position.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
        stage.vx * stage.deltaSeconds,
      ),
    }))
    .thru((stage) => ({
      ...stage,
      nextX: stage.horizontal.position,
      vxOut: getBlockedVx(stage.horizontal.isBlocked, stage.vx),
    }))
    .thru((stage) => ({
      ...stage,
      vertical: moveVertical(
        level,
        stage.nextX,
        player.position.y,
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
    .thru((stage): Player => ({
      position: { x: stage.nextX, y: stage.nextY },
      velocity: {
        x: { current: stage.vxOut, max: player.velocity.x.max },
        y: { current: stage.vy, max: player.velocity.y.max },
      },
      hearts: player.hearts,
      timers: player.timers,
      statuses: {
        isFacingRight: stage.isFacingRight,
        isGrounded: stage.isGrounded,
        isJumpQueued: false,
      },
    }))
    .value();

export const stepPlayer = (
  level: Level,
  player: Player,
  input: InputState,
  elapsedSeconds: number,
): Player => {
  const deltaSeconds = Math.min(elapsedSeconds, MAX_TICK_SECONDS);
  const intent = getPlayerIntent(player, input, deltaSeconds);
  return resolvePlayer(level, player, intent);
};
