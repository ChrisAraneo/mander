import {
  type Enemy,
  type EnemyKind,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { FREEZING_RANGE, FREEZING_RELOAD_SECONDS } from '../consts';
import { createFreezingTickShot } from './create-freezing-tick-shot';

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
  position: { x: left, y: 56 },
});

const createEnemy = (kind: EnemyKind, reload: number): Enemy => ({
  kind,
  position: { x: 320, y: 64 },
  velocity: {
    x: { current: 0, max: 39 },
    y: { current: 0, max: 301 },
  },
  timers: { death: null, reload },
  spawn: { x: 320, y: 64 },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('createFreezingTickShot', () => {
  it('should keep the same enemy, keep its reload and throw nothing when the player is out of range', () => {
    const freezer = createEnemy('FREEZING', 0);

    const shot = createFreezingTickShot(
      freezer,
      createPlayerAt(320 + FREEZING_RANGE + 64),
      0.5,
    );

    expect(shot.enemy).toBe(freezer);
    expect(shot.enemy.timers.reload).toBe(0);
    expect(shot.snowball).toBeUndefined();
  });

  it('should count down the reload and throw nothing when the player is in range and the enemy is still loading', () => {
    const shot = createFreezingTickShot(
      createEnemy('FREEZING', 10),
      createPlayerAt(400),
      0.02,
    );

    expect(shot.enemy.timers.reload).toBeCloseTo(9.98, 6);
    expect(shot.snowball).toBeUndefined();
  });

  it('should throw a snowball and start a new reload when the player is in range and the enemy finishes loading', () => {
    const shot = createFreezingTickShot(
      createEnemy('FREEZING', 0.01),
      createPlayerAt(400),
      0.02,
    );

    expect(shot.snowball).toBeDefined();
    expect(shot.enemy.timers.reload).toBeCloseTo(
      0.01 - 0.02 + FREEZING_RELOAD_SECONDS,
      6,
    );
  });

  it('should leave a shooter enemy alone when the player is in range', () => {
    const shooter = createEnemy('SHOOTER', 0);

    const shot = createFreezingTickShot(shooter, createPlayerAt(400), 0.02);

    expect(shot.enemy).toBe(shooter);
    expect(shot.snowball).toBeUndefined();
  });

  it('should leave a dying freezing enemy alone when the player is in range', () => {
    const dying = {
      ...createEnemy('FREEZING', 0),
      timers: { death: 0.1, reload: 0 },
    };

    const shot = createFreezingTickShot(dying, createPlayerAt(400), 0.02);

    expect(shot.enemy).toBe(dying);
    expect(shot.snowball).toBeUndefined();
  });
});
