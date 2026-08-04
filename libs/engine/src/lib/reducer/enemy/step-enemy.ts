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
import { ENEMY_DEATH_SECONDS, ENEMY_HEIGHT, ENEMY_WIDTH } from './consts';
import { ledgeAhead } from './ledge-ahead';
import { playerOverhead } from './player-overhead';
import { spikeAhead } from './spike-ahead';
import { wallAhead } from './wall-ahead';

const opposite = (facing: 1 | -1): 1 | -1 =>
  match(facing)
    .with(1, (): 1 | -1 => -1)
    .otherwise((): 1 | -1 => 1);

const facingOf = (enemy: Enemy): 1 | -1 =>
  match(enemy.statuses.isFacingRight)
    .with(true, (): 1 | -1 => 1)
    .otherwise((): 1 | -1 => -1);

const enemyHop = (
  isGrounded: boolean,
  vy: number,
  enemy: Enemy,
  player: Player,
): { vy: number; isGrounded: boolean } =>
  match({ isGrounded, isOverhead: playerOverhead(enemy, player) })
    .with({ isGrounded: true, isOverhead: true }, () => ({
      vy: -enemy.velocity.y.max,
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

const lostToThePit = (enemy: Enemy): Enemy => ({
  ...enemy,
  velocity: {
    x: { ...enemy.velocity.x, current: 0 },
    y: { ...enemy.velocity.y, current: 0 },
  },
  timers: { ...enemy.timers, death: ENEMY_DEATH_SECONDS },
});

const toEnemy = (motion: EnemyMotion, enemy: Enemy, level: Level): Enemy =>
  match(motion.y > (level.height + 2) * TILE_SIZE)
    .with(true, (): Enemy => lostToThePit(enemy))
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

const enemyIntent = (
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
    facing: facingOf(enemy),
    isGrounded: enemy.statuses.isGrounded,
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
