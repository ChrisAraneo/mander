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
import { SHOOTER_RANGE } from '../consts';
import { isArmedShooter } from './is-armed-shooter';

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

const createEnemy = (kind: EnemyKind, death: number | null = null): Enemy => ({
  kind,
  position: { x: 320, y: 64 },
  velocity: {
    x: { current: 0, max: 39 },
    y: { current: 0, max: 301 },
  },
  timers: { death, reload: 0 },
  spawn: { x: 320, y: 64 },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('isArmedShooter', () => {
  it('should call it armed when a living shooter has the player in range', () => {
    const isArmed = isArmedShooter(createEnemy('SHOOTER'), createPlayerAt(400));

    expect(isArmed).toBe(true);
  });

  it('should not call it armed when the shooter is dying', () => {
    const isArmed = isArmedShooter(
      createEnemy('SHOOTER', 0.1),
      createPlayerAt(400),
    );

    expect(isArmed).toBe(false);
  });

  it('should not call it armed when the player is out of range', () => {
    const isArmed = isArmedShooter(
      createEnemy('SHOOTER'),
      createPlayerAt(320 + SHOOTER_RANGE + 64),
    );

    expect(isArmed).toBe(false);
  });

  it('should not call it armed when a horned enemy has the player in range', () => {
    const isArmed = isArmedShooter(createEnemy('HORNED'), createPlayerAt(400));

    expect(isArmed).toBe(false);
  });

  it('should not call it armed when a hopping enemy has the player in range', () => {
    const isArmed = isArmedShooter(createEnemy('HOPPING'), createPlayerAt(400));

    expect(isArmed).toBe(false);
  });
});
