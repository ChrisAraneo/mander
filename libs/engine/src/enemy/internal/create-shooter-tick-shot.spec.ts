import {
  type Enemy,
  type EnemyKind,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
import { SHOOTER_RANGE, SHOOTER_RELOAD_SECONDS } from '../consts';
import { createShooterTickShot } from './create-shooter-tick-shot';

const ENEMY_LEFT = 10 * TILE_SIZE;
const ENEMY_TOP = 2 * TILE_SIZE;
const ENEMY_TOP_MOVE_SPEED = 39;
const ENEMY_TOP_FALL_SPEED = 301;
const PLAYER_TOP = 56;
const NEAR_LEFT = 400;

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', '#####']);

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: PLAYER_TOP },
});

const createEnemy = (kind: EnemyKind, reload: number): Enemy => ({
  kind,
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: ENEMY_TOP_MOVE_SPEED },
    y: { current: 0, max: ENEMY_TOP_FALL_SPEED },
  },
  timers: { death: null, reload },
  spawn: { x: ENEMY_LEFT, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('createShooterTickShot', () => {
  it('should keep the same enemy, keep its reload and fire nothing when the player is out of range', () => {
    const shooter = createEnemy('SHOOTER', 0);

    const shot = createShooterTickShot(
      shooter,
      createPlayerAt(ENEMY_LEFT + SHOOTER_RANGE + 2 * TILE_SIZE),
      0.5,
    );

    expect(shot.enemy).toBe(shooter);
    expect(shot.enemy.timers.reload).toBe(0);
    expect(shot.cannonball).toBeUndefined();
  });

  it('should count down the reload and fire nothing when the player is in range and the shooter is still loading', () => {
    const shot = createShooterTickShot(
      createEnemy('SHOOTER', 10),
      createPlayerAt(NEAR_LEFT),
      0.02,
    );

    expect(shot.enemy.timers.reload).toBeCloseTo(9.98, 6);
    expect(shot.cannonball).toBeUndefined();
  });

  it('should fire a cannonball and start a new reload when the player is in range and the shooter finishes loading', () => {
    const shot = createShooterTickShot(
      createEnemy('SHOOTER', 0.01),
      createPlayerAt(NEAR_LEFT),
      0.02,
    );

    expect(shot.cannonball).toBeDefined();
    expect(shot.enemy.timers.reload).toBeCloseTo(
      0.01 - 0.02 + SHOOTER_RELOAD_SECONDS,
      6,
    );
  });

  it('should leave a horned enemy alone when the player is in range', () => {
    const horned = createEnemy('HORNED', 0);

    const shot = createShooterTickShot(horned, createPlayerAt(NEAR_LEFT), 0.02);

    expect(shot.enemy).toBe(horned);
    expect(shot.cannonball).toBeUndefined();
  });

  it('should leave a dying shooter alone when the player is in range', () => {
    const dying = {
      ...createEnemy('SHOOTER', 0),
      timers: { death: 0.1, reload: 0 },
    };

    const shot = createShooterTickShot(dying, createPlayerAt(NEAR_LEFT), 0.02);

    expect(shot.enemy).toBe(dying);
    expect(shot.cannonball).toBeUndefined();
  });
});
