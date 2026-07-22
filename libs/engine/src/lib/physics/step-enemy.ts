import { chain } from 'lodash-es';
import { match } from 'ts-pattern';
import { TILE_SIZE, type Level } from '@mander/generator';
import { ENEMY_HEIGHT, ENEMY_JUMP_VELOCITY, ENEMY_MOVE_SPEED, ENEMY_WIDTH } from '../state';
import type { Enemy, Player } from '../state';
import { GRAVITY, MAX_TICK_SECONDS, TERMINAL_VELOCITY } from './constants';
import { resolveLanding } from './landing';
import { ledgeAhead } from './ledge-ahead';
import { moveHorizontal } from './move-horizontal';
import { moveVertical } from './move-vertical';
import { playerOverhead } from './player-overhead';
import { spikeAhead } from './spike-ahead';
import { wallAhead } from './wall-ahead';

const enemyHop = (
  grounded: boolean,
  vy: number,
  enemy: Enemy,
  player: Player
): { vy: number; grounded: boolean } =>
  match({ grounded, overhead: playerOverhead(enemy, player) })
    .with({ grounded: true, overhead: true }, () => ({ vy: -ENEMY_JUMP_VELOCITY, grounded: false }))
    .otherwise(() => ({ vy, grounded }));

const enemyTurn = (level: Level, x: number, y: number, facing: 1 | -1, grounded: boolean): 1 | -1 =>
  match({
    grounded,
    obstacle:
      wallAhead(level, x, y, facing) ||
      ledgeAhead(level, x, y, facing) ||
      spikeAhead(level, x, y, facing),
  })
    .with({ grounded: true, obstacle: true }, () => -facing as 1 | -1)
    .otherwise(() => facing);

const turnOnBlock = (isBlocked: boolean, facing: 1 | -1): 1 | -1 =>
  match(isBlocked)
    .with(true, () => -facing as 1 | -1)
    .otherwise(() => facing);

const toEnemy = (
  x: number,
  y: number,
  vy: number,
  facing: 1 | -1,
  grounded: boolean,
  enemy: Enemy,
  level: Level
): Enemy =>
  match(y > (level.height + 2) * TILE_SIZE)
    .with(true, (): Enemy => ({ ...enemy, x: enemy.homeX, y: enemy.homeY, vx: 0, vy: 0, grounded: false }))
    .otherwise(
      (): Enemy => ({
        x,
        y,
        vx: facing * ENEMY_MOVE_SPEED,
        vy,
        facing,
        grounded,
        homeX: enemy.homeX,
        homeY: enemy.homeY,
      })
    );

export const stepEnemy = (level: Level, enemy: Enemy, player: Player, elapsedSeconds: number): Enemy =>
  chain({
    deltaSeconds: Math.min(elapsedSeconds, MAX_TICK_SECONDS),
    x: enemy.x,
    y: enemy.y,
    vy: enemy.vy,
    facing: enemy.facing,
    grounded: enemy.grounded,
  })
    .thru((s) => ({ ...s, ...enemyHop(s.grounded, s.vy, enemy, player) }))
    .thru((s) => ({ ...s, facing: enemyTurn(level, s.x, s.y, s.facing, s.grounded) }))
    .thru((s) => ({ ...s, vy: Math.min(s.vy + GRAVITY * s.deltaSeconds, TERMINAL_VELOCITY) }))
    .thru((s) => ({
      ...s,
      horizontal: moveHorizontal(
        level,
        s.x,
        s.y,
        ENEMY_WIDTH,
        ENEMY_HEIGHT,
        s.facing * ENEMY_MOVE_SPEED * s.deltaSeconds
      ),
    }))
    .thru((s) => ({ ...s, x: s.horizontal.position, facing: turnOnBlock(s.horizontal.isBlocked, s.facing) }))
    .thru((s) => ({
      ...s,
      vertical: moveVertical(level, s.x, s.y, ENEMY_WIDTH, ENEMY_HEIGHT, s.vy * s.deltaSeconds),
    }))
    .thru((s) => ({
      ...s,
      y: s.vertical.position,
      ...resolveLanding(s.vertical.isBlocked, s.vy > 0, s.grounded, s.vy),
    }))
    .thru((s): Enemy => toEnemy(s.x, s.y, s.vy, s.facing, s.grounded, enemy, level))
    .value();
