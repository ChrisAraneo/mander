import {
  type Enemy,
  GRAVITY,
  type Level,
  MAX_TICK_SECONDS,
  type Player,
  TERMINAL_VELOCITY,
  TILE_SIZE,
} from '@mander/model';
import { chain } from '@mander/utils';
import { match } from 'ts-pattern';

import { moveVertical } from '../collision/move-vertical';
import { resolveLanding } from '../collision/resolve-landing';
import { ENEMY_DEATH_SECONDS, ENEMY_HEIGHT, ENEMY_WIDTH } from './consts';
import { playerNearTrap } from './player-near-trap';
import type { TrapMotion } from './types/trap-motion';

const snapShut = (
  isGrounded: boolean,
  vy: number,
  trap: Enemy,
  player: Player,
): { vy: number; isGrounded: boolean } =>
  match({ isGrounded, isNear: playerNearTrap(trap, player) })
    .with({ isGrounded: true, isNear: true }, () => ({
      vy: -trap.velocity.y.max,
      isGrounded: false,
    }))
    .otherwise(() => ({ vy, isGrounded }));

const lostToThePit = (trap: Enemy): Enemy => ({
  ...trap,
  velocity: {
    x: { ...trap.velocity.x, current: 0 },
    y: { ...trap.velocity.y, current: 0 },
  },
  timers: { ...trap.timers, death: ENEMY_DEATH_SECONDS },
});

const toBeartrap = (motion: TrapMotion, trap: Enemy, level: Level): Enemy =>
  match(motion.y > (level.height + 2) * TILE_SIZE)
    .with(true, (): Enemy => lostToThePit(trap))
    .otherwise((): Enemy => ({
      ...trap,
      position: { ...trap.position, y: motion.y },
      velocity: {
        x: { ...trap.velocity.x, current: 0 },
        y: { ...trap.velocity.y, current: motion.vy },
      },
      statuses: { ...trap.statuses, isGrounded: motion.isGrounded },
    }));

const trapIntent = (
  trap: Enemy,
  player: Player,
  deltaSeconds: number,
): TrapMotion =>
  chain({
    deltaSeconds,
    y: trap.position.y,
    vy: trap.velocity.y.current,
    isGrounded: trap.statuses.isGrounded,
  })
    .thru((stage) => ({
      ...stage,
      ...snapShut(stage.isGrounded, stage.vy, trap, player),
    }))
    .thru((stage) => ({
      ...stage,
      vy: Math.min(stage.vy + GRAVITY * stage.deltaSeconds, TERMINAL_VELOCITY),
    }))
    .value();

const resolveBeartrap = (
  level: Level,
  trap: Enemy,
  motion: TrapMotion,
): Enemy =>
  chain(motion)
    .thru((stage) => ({
      ...stage,
      vertical: moveVertical(
        level,
        trap.position.x,
        stage.y,
        ENEMY_WIDTH,
        ENEMY_HEIGHT,
        stage.vy * stage.deltaSeconds,
      ),
    }))
    .thru((stage) => ({
      ...stage,
      y: stage.vertical.position,
      ...resolveLanding(
        stage.vertical.isBlocked,
        stage.vy > 0,
        stage.isGrounded,
        stage.vy,
      ),
    }))
    .thru((stage): Enemy => toBeartrap(stage, trap, level))
    .value();

export const stepBeartrap = (
  level: Level,
  trap: Enemy,
  player: Player,
  elapsedSeconds: number,
): Enemy => {
  const deltaSeconds = Math.min(elapsedSeconds, MAX_TICK_SECONDS);
  return resolveBeartrap(level, trap, trapIntent(trap, player, deltaSeconds));
};
