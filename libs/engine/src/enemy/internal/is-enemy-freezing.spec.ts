import { type Enemy, type EnemyKind, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isEnemyFreezing } from './is-enemy-freezing';

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

describe('isEnemyFreezing', () => {
  it('should call it freezing when the enemy throws snowballs', () => {
    expect(isEnemyFreezing(createEnemy('FREEZING'))).toBe(true);
  });

  it('should not call it freezing when the enemy shoots cannonballs', () => {
    expect(isEnemyFreezing(createEnemy('SHOOTER'))).toBe(false);
  });

  it('should not call it freezing when the enemy is horned', () => {
    expect(isEnemyFreezing(createEnemy('HORNED'))).toBe(false);
  });

  it('should not call it freezing when the enemy is hopping', () => {
    expect(isEnemyFreezing(createEnemy('HOPPING'))).toBe(false);
  });

  it('should not call it freezing when the enemy is a beartrap', () => {
    expect(isEnemyFreezing(createEnemy('BEARTRAP'))).toBe(false);
  });

  it('should not call it a freezing enemy when the enemy is fast', () => {
    expect(isEnemyFreezing(createEnemy('FAST'))).toBe(false);
  });

  it('should not call it a freezing enemy when the enemy is flying', () => {
    expect(isEnemyFreezing(createEnemy('FLYING'))).toBe(false);
  });
});
