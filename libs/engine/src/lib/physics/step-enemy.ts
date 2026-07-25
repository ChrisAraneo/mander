import { type Level, TILE_SIZE } from '@mander/generator';
import { chain } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Enemy, Player } from '../state';
import {
  ENEMY_HEIGHT,
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  ENEMY_WIDTH,
} from '../state';
import { GRAVITY, MAX_TICK_SECONDS, TERMINAL_VELOCITY } from './constants';
import { resolveLanding } from './resolve-landing';
import { ledgeAhead } from './ledge-ahead';
import { moveHorizontal } from './move-horizontal';
import { moveVertical } from './move-vertical';
import { playerOverhead } from './player-overhead';
import { spikeAhead } from './spike-ahead';
import { wallAhead } from './wall-ahead';

const opposite = (facing: 1 | -1): 1 | -1 =>
  match(facing)
    .with(1, (): 1 | -1 => -1)
    .otherwise((): 1 | -1 => 1);

const enemyHop = (
  isGrounded: boolean,
  vy: number,
  enemy: Enemy,
  player: Player,
): { vy: number; isGrounded: boolean } =>
  match({ isGrounded, isOverhead: playerOverhead(enemy, player) })
    .with({ isGrounded: true, isOverhead: true }, () => ({
      vy: -ENEMY_JUMP_VELOCITY,
      isGrounded: false,
    }))
    .otherwise(() => ({ vy, isGrounded }));

const enemyTurn = (
  level: Level,
  x: number,
  y: number,
  facing: 1 | -1,
  isGrounded: boolean,
): 1 | -1 =>
  match({
    isGrounded,
    hasObstacle:
      wallAhead(level, x, y, facing) ||
      ledgeAhead(level, x, y, facing) ||
      spikeAhead(level, x, y, facing),
  })
    .with({ isGrounded: true, hasObstacle: true }, () => opposite(facing))
    .otherwise(() => facing);

const turnOnBlock = (isBlocked: boolean, facing: 1 | -1): 1 | -1 =>
  match(isBlocked)
    .with(true, () => opposite(facing))
    .otherwise(() => facing);

interface EnemyMotion {
  deltaSeconds: number;
  x: number;
  y: number;
  vy: number;
  facing: 1 | -1;
  isGrounded: boolean;
}

const toEnemy = (motion: EnemyMotion, enemy: Enemy, level: Level): Enemy =>
  match(motion.y > (level.height + 2) * TILE_SIZE)
    .with(
      true,
      (): Enemy => ({
        ...enemy,
        x: enemy.homeX,
        y: enemy.homeY,
        vx: 0,
        vy: 0,
        isGrounded: false,
      }),
    )
    .otherwise(
      (): Enemy => ({
        x: motion.x,
        y: motion.y,
        vx: motion.facing * ENEMY_MOVE_SPEED,
        vy: motion.vy,
        facing: motion.facing,
        isGrounded: motion.isGrounded,
        homeX: enemy.homeX,
        homeY: enemy.homeY,
        dyingFor: enemy.dyingFor,
      }),
    );

const enemyIntent = (
  level: Level,
  enemy: Enemy,
  player: Player,
  deltaSeconds: number,
): EnemyMotion =>
  chain({
    deltaSeconds,
    x: enemy.x,
    y: enemy.y,
    vy: enemy.vy,
    facing: enemy.facing,
    isGrounded: enemy.isGrounded,
  })
    .thru((stage) => ({
      ...stage,
      ...enemyHop(stage.isGrounded, stage.vy, enemy, player),
    }))
    .thru((stage) => ({
      ...stage,
      facing: enemyTurn(
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
        stage.facing * ENEMY_MOVE_SPEED * stage.deltaSeconds,
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
    .thru((stage): Enemy => toEnemy(stage, enemy, level))
    .value();

export const stepEnemy = (
  level: Level,
  enemy: Enemy,
  player: Player,
  elapsedSeconds: number,
): Enemy => {
  const deltaSeconds = Math.min(elapsedSeconds, MAX_TICK_SECONDS);
  const motion = enemyIntent(level, enemy, player, deltaSeconds);
  return resolveEnemy(level, enemy, motion);
};
