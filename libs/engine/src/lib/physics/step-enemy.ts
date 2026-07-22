import { TILE_SIZE, type Level } from '@mander/generator';
import { ENEMY_HEIGHT, ENEMY_JUMP_VELOCITY, ENEMY_MOVE_SPEED, ENEMY_WIDTH } from '../state';
import type { Enemy, Player } from '../state';
import { GRAVITY, MAX_TICK_SECONDS, TERMINAL_VELOCITY } from './constants';
import { ledgeAhead } from './ledge-ahead';
import { moveHorizontal } from './move-horizontal';
import { moveVertical } from './move-vertical';
import { playerOverhead } from './player-overhead';
import { spikeAhead } from './spike-ahead';
import { wallAhead } from './wall-ahead';

export function stepEnemy(level: Level, enemy: Enemy, player: Player, elapsedSeconds: number): Enemy {
  const deltaSeconds = Math.min(elapsedSeconds, MAX_TICK_SECONDS);
  let { x, y, vy, facing, grounded } = enemy;

  if (grounded && playerOverhead(enemy, player)) {
    vy = -ENEMY_JUMP_VELOCITY;
    grounded = false;
  }

  if (
    grounded &&
    (wallAhead(level, x, y, facing) ||
      ledgeAhead(level, x, y, facing) ||
      spikeAhead(level, x, y, facing))
  ) {
    facing = -facing as 1 | -1;
  }

  vy = Math.min(vy + GRAVITY * deltaSeconds, TERMINAL_VELOCITY);

  const horizontal = moveHorizontal(level, x, y, ENEMY_WIDTH, ENEMY_HEIGHT, facing * ENEMY_MOVE_SPEED * deltaSeconds);
  x = horizontal.position;
  if (horizontal.isBlocked) facing = -facing as 1 | -1;

  const vertical = moveVertical(level, x, y, ENEMY_WIDTH, ENEMY_HEIGHT, vy * deltaSeconds);
  y = vertical.position;
  if (vertical.isBlocked) {
    if (vy > 0) grounded = true;
    vy = 0;
  } else if (vy > 0) {
    grounded = false;
  }

  if (y > (level.height + 2) * TILE_SIZE) {
    return { ...enemy, x: enemy.homeX, y: enemy.homeY, vx: 0, vy: 0, grounded: false };
  }

  return { x, y, vx: facing * ENEMY_MOVE_SPEED, vy, facing, grounded, homeX: enemy.homeX, homeY: enemy.homeY };
}
