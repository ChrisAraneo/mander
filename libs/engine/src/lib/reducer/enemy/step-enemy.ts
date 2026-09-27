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

import { moveHorizontal } from '../collision/move-horizontal';
import { moveVertical } from '../collision/move-vertical';
import { resolveLanding } from '../collision/resolve-landing';
import { isSpikeAhead } from '../spike/is-spike-ahead';
import { isBeartrapAhead } from './is-beartrap-ahead';
import { ENEMY_DEATH_SECONDS, ENEMY_HEIGHT, ENEMY_WIDTH } from './consts';
import { isLedgeAhead } from './is-ledge-ahead';
import { isPlayerOverhead } from './is-player-overhead';
import type { EnemyMotion } from './types/enemy-motion';
import { isWallAhead } from './is-wall-ahead';

const flipFacing = (facing: 1 | -1): 1 | -1 =>
  match(facing)
    .with(1, (): 1 | -1 => -1)
    .otherwise((): 1 | -1 => 1);

const getFacing = (enemy: Enemy): 1 | -1 =>
  match(enemy.statuses.isFacingRight)
    .with(true, (): 1 | -1 => 1)
    .otherwise((): 1 | -1 => -1);

const getEnemyHop = (
  isGrounded: boolean,
  vy: number,
  enemy: Enemy,
  player: Player,
): { vy: number; isGrounded: boolean } =>
  match({ isGrounded, isOverhead: isPlayerOverhead(enemy, player) })
    .with({ isGrounded: true, isOverhead: true }, () => ({
      vy: -enemy.velocity.y.max,
      isGrounded: false,
    }))
    .otherwise(() => ({ vy, isGrounded }));

const getEnemyTurn = (
  level: Level,
  x: number,
  y: number,
  facing: 1 | -1,
  isGrounded: boolean,
): 1 | -1 =>
  match({
    isGrounded,
    hasObstacle:
      isWallAhead(level, x, y, facing) ||
      isLedgeAhead(level, x, y, facing) ||
      isSpikeAhead(level, x, y, facing) ||
      isBeartrapAhead(level, x, y, facing),
  })
    .with({ isGrounded: true, hasObstacle: true }, () => flipFacing(facing))
    .otherwise(() => facing);

const turnOnBlock = (isBlocked: boolean, facing: 1 | -1): 1 | -1 =>
  match(isBlocked)
    .with(true, () => flipFacing(facing))
    .otherwise(() => facing);

const loseToThePit = (enemy: Enemy): Enemy => ({
  ...enemy,
  velocity: {
    x: { ...enemy.velocity.x, current: 0 },
    y: { ...enemy.velocity.y, current: 0 },
  },
  timers: { ...enemy.timers, death: ENEMY_DEATH_SECONDS },
});

const applyEnemyMotion = (
  motion: EnemyMotion,
  enemy: Enemy,
  level: Level,
): Enemy =>
  match(motion.y > (level.height + 2) * TILE_SIZE)
    .with(true, (): Enemy => loseToThePit(enemy))
    .otherwise((): Enemy => ({
      kind: enemy.kind,
      position: { x: motion.x, y: motion.y },
      velocity: {
        x: {
          current: motion.facing * enemy.velocity.x.max,
          max: enemy.velocity.x.max,
        },
        y: { current: motion.vy, max: enemy.velocity.y.max },
      },
      timers: enemy.timers,
      spawn: enemy.spawn,
      statuses: {
        isFacingRight: motion.facing > 0,
        isGrounded: motion.isGrounded,
      },
    }));

const getEnemyIntent = (
  level: Level,
  enemy: Enemy,
  player: Player,
  deltaSeconds: number,
): EnemyMotion =>
  chain({
    deltaSeconds,
    x: enemy.position.x,
    y: enemy.position.y,
    vy: enemy.velocity.y.current,
    facing: getFacing(enemy),
    isGrounded: enemy.statuses.isGrounded,
  })
    .thru((stage) => ({
      ...stage,
      ...getEnemyHop(stage.isGrounded, stage.vy, enemy, player),
    }))
    .thru((stage) => ({
      ...stage,
      facing: getEnemyTurn(
        level,
        stage.x,
        stage.y,
        stage.facing,
        stage.isGrounded,
      ),
    }))
    .thru((stage) => ({
      ...stage,
      vy: Math.min(stage.vy + GRAVITY * stage.deltaSeconds, TERMINAL_VELOCITY),
    }))
    .value();

const resolveEnemy = (level: Level, enemy: Enemy, motion: EnemyMotion): Enemy =>
  chain(motion)
    .thru((stage) => ({
      ...stage,
      horizontal: moveHorizontal(
        level,
        stage.x,
        stage.y,
        ENEMY_WIDTH,
        ENEMY_HEIGHT,
        stage.facing * enemy.velocity.x.max * stage.deltaSeconds,
      ),
    }))
    .thru((stage) => ({
      ...stage,
      x: stage.horizontal.position,
      facing: turnOnBlock(stage.horizontal.isBlocked, stage.facing),
    }))
    .thru((stage) => ({
      ...stage,
      vertical: moveVertical(
        level,
        stage.x,
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
    .thru((stage): Enemy => applyEnemyMotion(stage, enemy, level))
    .value();

export const stepEnemy = (
  level: Level,
  enemy: Enemy,
  player: Player,
  elapsedSeconds: number,
): Enemy => {
  const deltaSeconds = Math.min(elapsedSeconds, MAX_TICK_SECONDS);
  const motion = getEnemyIntent(level, enemy, player, deltaSeconds);
  return resolveEnemy(level, enemy, motion);
};
