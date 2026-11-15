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
import { createShooterTickShots } from './create-shooter-tick-shots';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const ENEMY_LEFT = 10 * TILE_SIZE;
const ENEMY_TOP = 2 * TILE_SIZE;
const ENEMY_TOP_MOVE_SPEED = 39;
const ENEMY_TOP_FALL_SPEED = 301;
const PLAYER_LEFT = 400;
const PLAYER_TOP = 56;
const LOADED_RELOAD = 0;
const TICK_SECONDS = 0.02;

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

const PLAYER: Player = {
  ...BASE_PLAYER,
  position: { x: PLAYER_LEFT, y: PLAYER_TOP },
};

const createEnemy = (kind: EnemyKind): Enemy => ({
  kind,
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: ENEMY_TOP_MOVE_SPEED },
    y: { current: 0, max: ENEMY_TOP_FALL_SPEED },
  },
  timers: { death: null, reload: LOADED_RELOAD },
  spawn: { x: ENEMY_LEFT, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('createShooterTickShots', () => {
  it('should give one shot for every enemy when it is given enemies', () => {
    const shots = createShooterTickShots({
      enemies: [createEnemy('SHOOTER'), createEnemy('HOPPING')],
      player: PLAYER,
      deltaSeconds: TICK_SECONDS,
    });

    expect(size(shots)).toBe(2);
  });

  it('should give no shots when it is given no enemies', () => {
    const shots = createShooterTickShots({
      enemies: [],
      player: PLAYER,
      deltaSeconds: TICK_SECONDS,
    });

    expect(shots).toEqual([]);
  });

  it('should arm the shooter when it has the player in range', () => {
    const shots = createShooterTickShots({
      enemies: [createEnemy('SHOOTER')],
      player: PLAYER,
      deltaSeconds: TICK_SECONDS,
    });

    expect(shots[0].cannonball).toBeDefined();
  });

  it('should leave an enemy of another kind without ammunition when it is given one', () => {
    const shots = createShooterTickShots({
      enemies: [createEnemy('HOPPING')],
      player: PLAYER,
      deltaSeconds: TICK_SECONDS,
    });

    expect(shots[0].cannonball).toBeUndefined();
  });

  it('should leave the given enemies unchanged when it works out the shots', () => {
    const enemies = [createEnemy('SHOOTER')];

    createShooterTickShots({
      enemies,
      player: PLAYER,
      deltaSeconds: TICK_SECONDS,
    });

    expect(enemies).toEqual([createEnemy('SHOOTER')]);
  });
});
