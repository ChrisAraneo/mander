import { type Enemy, type EnemyKind, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isEnemyShooter } from './is-enemy-shooter';

const ENEMY_LEFT = 10 * TILE_SIZE;
const ENEMY_TOP = 2 * TILE_SIZE;
const ENEMY_TOP_MOVE_SPEED = 39;
const ENEMY_TOP_FALL_SPEED = 301;

const createEnemy = (kind: EnemyKind): Enemy => ({
  kind,
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: ENEMY_TOP_MOVE_SPEED },
    y: { current: 0, max: ENEMY_TOP_FALL_SPEED },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: ENEMY_LEFT, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('isEnemyShooter', () => {
  it('should call it a shooter when the enemy shoots', () => {
    expect(isEnemyShooter(createEnemy('SHOOTER'))).toBe(true);
  });

  it('should not call it a shooter when the enemy is horned', () => {
    expect(isEnemyShooter(createEnemy('HORNED'))).toBe(false);
  });

  it('should not call it a shooter when the enemy is hopping', () => {
    expect(isEnemyShooter(createEnemy('HOPPING'))).toBe(false);
  });

  it('should not call it a shooter when the enemy is a beartrap', () => {
    expect(isEnemyShooter(createEnemy('BEARTRAP'))).toBe(false);
  });

  it('should not call it a shooter when the enemy is fast', () => {
    expect(isEnemyShooter(createEnemy('FAST'))).toBe(false);
  });

  it('should not call it a shooter when the enemy is freezing', () => {
    expect(isEnemyShooter(createEnemy('FREEZING'))).toBe(false);
  });

  it('should not call it a shooter when the enemy is flying', () => {
    expect(isEnemyShooter(createEnemy('FLYING'))).toBe(false);
  });
});
