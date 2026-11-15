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

import { BASE_HEARTS } from '../player/consts';
import { createPlayer } from '../player/create-player';
import type { GameLevel } from '../state/types/game-level';
import { SHOOTER_RANGE, SHOOTER_RELOAD_SECONDS } from './consts';
import { nextShooters } from './next-shooters';

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

const ENEMY_TOP = 2 * TILE_SIZE;
const ENEMY_TOP_MOVE_SPEED = 39;
const ENEMY_TOP_FALL_SPEED = 301;
const PLAYER_TOP = 56;
const FIRST_ENEMY_LEFT = 10 * TILE_SIZE;
const SECOND_ENEMY_LEFT = 400;
const PLAYER_LEFT = 400;
const OUT_OF_RANGE_MARGIN = 2 * TILE_SIZE;
const LOADED_RELOAD = 0;
const LONG_RELOAD = 10;
const TICK_SECONDS = 0.02;

const LEVEL = createLevel(['.....', '.....', '#####']);

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: PLAYER_TOP },
});

const createEnemy = (kind: EnemyKind, left: number, reload: number): Enemy => ({
  kind,
  position: { x: left, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: ENEMY_TOP_MOVE_SPEED },
    y: { current: 0, max: ENEMY_TOP_FALL_SPEED },
  },
  timers: { death: null, reload },
  spawn: { x: left, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('nextShooters', () => {
  it('should give back no enemies and no cannonballs when the level has no enemies', () => {
    const salvo = nextShooters([], createPlayerAt(PLAYER_LEFT), TICK_SECONDS);

    expect(salvo).toEqual({ enemies: [], cannonballs: [] });
  });

  it('should hand every enemy back in the same order when the shooters fire', () => {
    const enemies = [
      createEnemy('HOPPING', FIRST_ENEMY_LEFT, LOADED_RELOAD),
      createEnemy('SHOOTER', 360, 0),
      createEnemy('HORNED', SECOND_ENEMY_LEFT, LOADED_RELOAD),
    ];

    const salvo = nextShooters(
      enemies,
      createPlayerAt(PLAYER_LEFT),
      TICK_SECONDS,
    );

    expect(map(salvo.enemies, (enemy) => enemy.kind)).toEqual([
      'HOPPING',
      'SHOOTER',
      'HORNED',
    ]);
  });

  it('should fire one cannonball per loaded shooter when the player is in range', () => {
    const enemies = [
      createEnemy('SHOOTER', FIRST_ENEMY_LEFT, LOADED_RELOAD),
      createEnemy('HOPPING', 360, 0),
      createEnemy('SHOOTER', SECOND_ENEMY_LEFT, LOADED_RELOAD),
    ];

    const salvo = nextShooters(
      enemies,
      createPlayerAt(PLAYER_LEFT),
      TICK_SECONDS,
    );

    expect(salvo.cannonballs).toHaveLength(2);
  });

  it('should fire nothing when the only shooter is still loading', () => {
    const enemies = [
      createEnemy('SHOOTER', FIRST_ENEMY_LEFT, SHOOTER_RELOAD_SECONDS),
    ];

    const salvo = nextShooters(
      enemies,
      createPlayerAt(PLAYER_LEFT),
      TICK_SECONDS,
    );

    expect(salvo.cannonballs).toEqual([]);
  });

  it('should fire nothing when the only shooter has the player out of range', () => {
    const enemies = [createEnemy('SHOOTER', FIRST_ENEMY_LEFT, LOADED_RELOAD)];

    const salvo = nextShooters(
      enemies,
      createPlayerAt(FIRST_ENEMY_LEFT + SHOOTER_RANGE + OUT_OF_RANGE_MARGIN),
      TICK_SECONDS,
    );

    expect(salvo.cannonballs).toEqual([]);
  });

  it('should count the reload down on every shooter in range when the tick passes', () => {
    const enemies = [createEnemy('SHOOTER', FIRST_ENEMY_LEFT, LONG_RELOAD)];

    const salvo = nextShooters(
      enemies,
      createPlayerAt(PLAYER_LEFT),
      TICK_SECONDS,
    );

    expect(salvo.enemies[0].timers.reload).toBeCloseTo(9.98, 6);
  });

  it('should leave the reload of enemies that do not shoot alone when the tick passes', () => {
    const enemies = [createEnemy('HOPPING', FIRST_ENEMY_LEFT, LONG_RELOAD)];

    const salvo = nextShooters(
      enemies,
      createPlayerAt(PLAYER_LEFT),
      TICK_SECONDS,
    );

    expect(salvo.enemies[0].timers.reload).toBe(10);
  });

  it('should leave the given enemies alone when the shooters fire', () => {
    const enemies = [createEnemy('SHOOTER', FIRST_ENEMY_LEFT, LOADED_RELOAD)];

    nextShooters(enemies, createPlayerAt(PLAYER_LEFT), TICK_SECONDS);

    expect(enemies[0].timers.reload).toBe(0);
  });
});
