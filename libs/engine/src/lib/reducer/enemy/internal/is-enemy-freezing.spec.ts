import { type Enemy, type EnemyKind } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isEnemyFreezing } from './is-enemy-freezing';

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
});
