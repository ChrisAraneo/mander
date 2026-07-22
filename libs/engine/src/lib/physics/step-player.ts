import { chain } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Level } from '@mander/generator';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../state';
import type { InputState, Player, PlayerCapabilities } from '../state';
import { GRAVITY, MAX_TICK_SECONDS, TERMINAL_VELOCITY } from './constants';
import { resolveLanding } from './landing';
import { moveHorizontal } from './move-horizontal';
import { moveVertical } from './move-vertical';

const JUMP_CUT_GRAVITY_FACTOR = 2.6;

const horizontalDirection = (input: InputState): number =>
  match(input)
    .with({ right: true, left: false }, () => 1)
    .with({ right: false, left: true }, () => -1)
    .otherwise(() => 0);

const facingFor = (direction: number, current: 1 | -1): 1 | -1 =>
  match(direction)
    .with(0, () => current)
    .otherwise(() => direction as 1 | -1);

const afterJump = (
  base: { vy: number; grounded: boolean },
  input: InputState,
  player: Player,
  capabilities: PlayerCapabilities
): { vy: number; grounded: boolean } =>
  match({ wants: player.jumpQueued || input.jump, grounded: base.grounded })
    .with({ wants: true, grounded: true }, () => ({ vy: -capabilities.jumpVelocity, grounded: false }))
    .otherwise(() => base);

const gravityFor = (vy: number, input: InputState): number =>
  match(vy < 0 && !input.jump)
    .with(true, () => GRAVITY * JUMP_CUT_GRAVITY_FACTOR)
    .otherwise(() => GRAVITY);

const blockedVx = (isBlocked: boolean, vx: number): number =>
  match(isBlocked)
    .with(true, () => 0)
    .otherwise(() => vx);

export const stepPlayer = (
  level: Level,
  player: Player,
  input: InputState,
  capabilities: PlayerCapabilities,
  elapsedSeconds: number
): Player =>
  chain({
    deltaSeconds: Math.min(elapsedSeconds, MAX_TICK_SECONDS),
    direction: horizontalDirection(input),
  })
    .thru((s) => ({
      ...s,
      vx: s.direction * capabilities.moveSpeed,
      facing: facingFor(s.direction, player.facing),
      ...afterJump({ vy: player.vy, grounded: player.grounded }, input, player, capabilities),
    }))
    .thru((s) => ({
      ...s,
      vy: Math.min(s.vy + gravityFor(s.vy, input) * s.deltaSeconds, TERMINAL_VELOCITY),
    }))
    .thru((s) => ({
      ...s,
      horizontal: moveHorizontal(level, player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT, s.vx * s.deltaSeconds),
    }))
    .thru((s) => ({
      ...s,
      nextX: s.horizontal.position,
      vxOut: blockedVx(s.horizontal.isBlocked, s.vx),
    }))
    .thru((s) => ({
      ...s,
      vertical: moveVertical(level, s.nextX, player.y, PLAYER_WIDTH, PLAYER_HEIGHT, s.vy * s.deltaSeconds),
    }))
    .thru((s) => ({
      ...s,
      nextY: s.vertical.position,
      ...resolveLanding(s.vertical.isBlocked, s.vy > 0, s.grounded, s.vy),
    }))
    .thru(
      (s): Player => ({
        x: s.nextX,
        y: s.nextY,
        vx: s.vxOut,
        vy: s.vy,
        grounded: s.grounded,
        facing: s.facing,
        jumpQueued: false,
      })
    )
    .value();
