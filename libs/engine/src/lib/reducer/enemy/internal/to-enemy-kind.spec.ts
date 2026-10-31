import {
  TILE_ENEMY,
  TILE_ENEMY_FAST,
  TILE_ENEMY_FLYING,
  TILE_ENEMY_FREEZING,
  TILE_ENEMY_HOPPING,
  TILE_ENEMY_HORNED,
  TILE_ENEMY_SHOOTER,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { toEnemyKind } from './to-enemy-kind';

describe('toEnemyKind', () => {
  it('should take the kind from the tile when the tile names a walking enemy', () => {
    expect(toEnemyKind(TILE_ENEMY_HOPPING, false, true, true, true, true)).toBe(
      'HOPPING',
    );
    expect(toEnemyKind(TILE_ENEMY_HORNED, false, false, true, true, true)).toBe(
      'HORNED',
    );
    expect(toEnemyKind(TILE_ENEMY_FAST, false, true, false, true, true)).toBe(
      'FAST',
    );
    expect(
      toEnemyKind(TILE_ENEMY_SHOOTER, false, true, true, false, true),
    ).toBe('SHOOTER');
    expect(
      toEnemyKind(TILE_ENEMY_FREEZING, false, true, true, true, false),
    ).toBe('FREEZING');
  });

  it('should take the kind from the tile when the tile names a flying enemy', () => {
    const kind = toEnemyKind(TILE_ENEMY_FLYING, false, true, true, true, true);

    expect(kind).toBe('FLYING');
  });

  it('should leave the tile standing when it names a walking enemy in the air', () => {
    const kind = toEnemyKind(
      TILE_ENEMY_HORNED,
      true,
      false,
      false,
      false,
      false,
    );

    expect(kind).toBe('HORNED');
  });

  it('should roll the kind when the tile leaves it to the level and the enemy starts in the air', () => {
    const kind = toEnemyKind(TILE_ENEMY, true, true, true, true, true);

    expect(kind).toBe('FLYING');
  });

  it('should roll a shooter when the tile leaves the kind to the level and the roll shoots', () => {
    const kind = toEnemyKind(TILE_ENEMY, false, true, true, true, true);

    expect(kind).toBe('SHOOTER');
  });

  it('should roll a freezing enemy when the tile leaves the kind to the level and the roll freezes', () => {
    const kind = toEnemyKind(TILE_ENEMY, false, true, true, false, true);

    expect(kind).toBe('FREEZING');
  });

  it('should roll a fast enemy when the tile leaves the kind to the level and the roll is fast', () => {
    const kind = toEnemyKind(TILE_ENEMY, false, true, true, false, false);

    expect(kind).toBe('FAST');
  });

  it('should roll a horned enemy when the tile leaves the kind to the level and the roll has horns', () => {
    const kind = toEnemyKind(TILE_ENEMY, false, true, false, false, false);

    expect(kind).toBe('HORNED');
  });

  it('should roll a hopping enemy when the tile leaves the kind to the level and no roll lands', () => {
    const kind = toEnemyKind(TILE_ENEMY, false, false, false, false, false);

    expect(kind).toBe('HOPPING');
  });
});
