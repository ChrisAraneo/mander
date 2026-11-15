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
import { FREEZING_RANGE } from '../consts';
import { isArmedFreezing } from './is-armed-freezing';

const ENEMY_LEFT = 10 * TILE_SIZE;
const ENEMY_TOP = 2 * TILE_SIZE;
const ENEMY_TOP_MOVE_SPEED = 39;
const ENEMY_TOP_FALL_SPEED = 301;
const PLAYER_TOP = 56;
const NEAR_LEFT = 400;
const DYING_SECONDS = 0.1;

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

const createEnemy = (kind: EnemyKind, death: number | null = null): Enemy => ({
  kind,
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: ENEMY_TOP_MOVE_SPEED },
    y: { current: 0, max: ENEMY_TOP_FALL_SPEED },
  },
  timers: { death, reload: 0 },
  spawn: { x: ENEMY_LEFT, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('isArmedFreezing', () => {
  it('should call it armed when a living freezing enemy has the player in range', () => {
    const isArmed = isArmedFreezing(
      createEnemy('FREEZING'),
      createPlayerAt(NEAR_LEFT),
    );

    expect(isArmed).toBe(true);
  });

  it('should not call it armed when the freezing enemy is dying', () => {
    const isArmed = isArmedFreezing(
      createEnemy('FREEZING', DYING_SECONDS),
      createPlayerAt(NEAR_LEFT),
    );

    expect(isArmed).toBe(false);
  });

  it('should not call it armed when the player is out of range', () => {
    const isArmed = isArmedFreezing(
      createEnemy('FREEZING'),
      createPlayerAt(ENEMY_LEFT + FREEZING_RANGE + 2 * TILE_SIZE),
    );

    expect(isArmed).toBe(false);
  });

  it('should not call it armed when a shooter enemy has the player in range', () => {
    const isArmed = isArmedFreezing(
      createEnemy('SHOOTER'),
      createPlayerAt(NEAR_LEFT),
    );

    expect(isArmed).toBe(false);
  });

  it('should not call it armed when a hopping enemy has the player in range', () => {
    const isArmed = isArmedFreezing(
      createEnemy('HOPPING'),
      createPlayerAt(NEAR_LEFT),
    );

    expect(isArmed).toBe(false);
  });
});
