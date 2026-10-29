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

import type { GameLevel } from '../../types/game-level';
import { BASE_HEARTS } from '../player/consts';
import { createPlayer } from '../player/create-player';
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
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', '#####']);

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: 56 },
});

const createEnemy = (kind: EnemyKind, left: number, reload: number): Enemy => ({
  kind,
  position: { x: left, y: 64 },
  velocity: {
    x: { current: 0, max: 39 },
    y: { current: 0, max: 301 },
  },
  timers: { death: null, reload },
  spawn: { x: left, y: 64 },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('nextShooters', () => {
  it('should give back no enemies and no cannonballs when the level has no enemies', () => {
    const salvo = nextShooters([], createPlayerAt(400), 0.02);

    expect(salvo).toEqual({ enemies: [], cannonballs: [] });
  });

  it('should hand every enemy back in the same order when the shooters fire', () => {
    const enemies = [
      createEnemy('HOPPING', 320, 0),
      createEnemy('SHOOTER', 360, 0),
      createEnemy('HORNED', 400, 0),
    ];

    const salvo = nextShooters(enemies, createPlayerAt(400), 0.02);

    expect(map(salvo.enemies, (enemy) => enemy.kind)).toEqual([
      'HOPPING',
      'SHOOTER',
      'HORNED',
    ]);
  });

  it('should fire one cannonball per loaded shooter when the player is in range', () => {
    const enemies = [
      createEnemy('SHOOTER', 320, 0),
      createEnemy('HOPPING', 360, 0),
      createEnemy('SHOOTER', 400, 0),
    ];

    const salvo = nextShooters(enemies, createPlayerAt(400), 0.02);

    expect(salvo.cannonballs).toHaveLength(2);
  });

  it('should fire nothing when the only shooter is still loading', () => {
    const enemies = [createEnemy('SHOOTER', 320, SHOOTER_RELOAD_SECONDS)];

    const salvo = nextShooters(enemies, createPlayerAt(400), 0.02);

    expect(salvo.cannonballs).toEqual([]);
  });

  it('should fire nothing when the only shooter has the player out of range', () => {
    const enemies = [createEnemy('SHOOTER', 320, 0)];

    const salvo = nextShooters(
      enemies,
      createPlayerAt(320 + SHOOTER_RANGE + 64),
      0.02,
    );

    expect(salvo.cannonballs).toEqual([]);
  });

  it('should count the reload down on every shooter in range when the tick passes', () => {
    const enemies = [createEnemy('SHOOTER', 320, 10)];

    const salvo = nextShooters(enemies, createPlayerAt(400), 0.02);

    expect(salvo.enemies[0].timers.reload).toBeCloseTo(9.98, 6);
  });

  it('should leave the reload of enemies that do not shoot alone when the tick passes', () => {
    const enemies = [createEnemy('HOPPING', 320, 10)];

    const salvo = nextShooters(enemies, createPlayerAt(400), 0.02);

    expect(salvo.enemies[0].timers.reload).toBe(10);
  });

  it('should leave the given enemies alone when the shooters fire', () => {
    const enemies = [createEnemy('SHOOTER', 320, 0)];

    nextShooters(enemies, createPlayerAt(400), 0.02);

    expect(enemies[0].timers.reload).toBe(0);
  });
});
