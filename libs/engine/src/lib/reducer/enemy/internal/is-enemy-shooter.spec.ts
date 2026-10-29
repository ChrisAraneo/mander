import { type Enemy, type EnemyKind } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isEnemyShooter } from './is-enemy-shooter';

const createEnemy = (kind: EnemyKind): Enemy => ({
  kind,
  position: { x: 320, y: 64 },
  velocity: {
    x: { current: 0, max: 39 },
    y: { current: 0, max: 301 },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: 320, y: 64 },
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
});
