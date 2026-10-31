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
import { FREEZING_RANGE, FREEZING_RELOAD_SECONDS } from './consts';
import { nextFreezers } from './next-freezers';

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

describe('nextFreezers', () => {
  it('should give back no enemies and no snowballs when the level has no enemies', () => {
    const blizzard = nextFreezers([], createPlayerAt(400), 0.02);

    expect(blizzard).toEqual({ enemies: [], snowballs: [] });
  });

  it('should hand every enemy back in the same order when the freezing enemies throw', () => {
    const enemies = [
      createEnemy('HOPPING', 320, 0),
      createEnemy('FREEZING', 360, 0),
      createEnemy('HORNED', 400, 0),
    ];

    const blizzard = nextFreezers(enemies, createPlayerAt(400), 0.02);

    expect(map(blizzard.enemies, (enemy) => enemy.kind)).toEqual([
      'HOPPING',
      'FREEZING',
      'HORNED',
    ]);
  });

  it('should throw one snowball per loaded freezing enemy when the player is in range', () => {
    const enemies = [
      createEnemy('FREEZING', 320, 0),
      createEnemy('HOPPING', 360, 0),
      createEnemy('FREEZING', 400, 0),
    ];

    const blizzard = nextFreezers(enemies, createPlayerAt(400), 0.02);

    expect(blizzard.snowballs).toHaveLength(2);
  });

  it('should throw nothing when the only freezing enemy is still loading', () => {
    const enemies = [createEnemy('FREEZING', 320, FREEZING_RELOAD_SECONDS)];

    const blizzard = nextFreezers(enemies, createPlayerAt(400), 0.02);

    expect(blizzard.snowballs).toEqual([]);
  });

  it('should throw nothing when the only freezing enemy has the player out of range', () => {
    const enemies = [createEnemy('FREEZING', 320, 0)];

    const blizzard = nextFreezers(
      enemies,
      createPlayerAt(320 + FREEZING_RANGE + 64),
      0.02,
    );

    expect(blizzard.snowballs).toEqual([]);
  });

  it('should throw nothing when the only ranged enemy shoots cannonballs instead', () => {
    const enemies = [createEnemy('SHOOTER', 320, 0)];

    const blizzard = nextFreezers(enemies, createPlayerAt(400), 0.02);

    expect(blizzard.snowballs).toEqual([]);
  });

  it('should count the reload down on every freezing enemy in range when the tick passes', () => {
    const enemies = [createEnemy('FREEZING', 320, 10)];

    const blizzard = nextFreezers(enemies, createPlayerAt(400), 0.02);

    expect(blizzard.enemies[0].timers.reload).toBeCloseTo(9.98, 6);
  });

  it('should leave the reload of enemies that do not freeze alone when the tick passes', () => {
    const enemies = [createEnemy('HOPPING', 320, 10)];

    const blizzard = nextFreezers(enemies, createPlayerAt(400), 0.02);

    expect(blizzard.enemies[0].timers.reload).toBe(10);
  });

  it('should leave the given enemies alone when the freezing enemies throw', () => {
    const enemies = [createEnemy('FREEZING', 320, 0)];

    nextFreezers(enemies, createPlayerAt(400), 0.02);

    expect(enemies[0].timers.reload).toBe(0);
  });
});
