import type { Enemy } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { matchEnemy } from './match-enemy';

const createTestEnemy = (spawnX: number, positionX: number): Enemy => ({
  kind: 'HOPPING',
  position: { x: positionX, y: 32 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  timers: { death: null },
  spawn: { x: spawnX, y: 32 },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('matchEnemy', () => {
  it('should match the enemies when they spawned at the same place', () => {
    const result = matchEnemy(createTestEnemy(64, 10), createTestEnemy(64, 30));

    expect(result).toBe(true);
  });

  it('should not match the enemies when they spawned at different places', () => {
    const result = matchEnemy(createTestEnemy(64, 10), createTestEnemy(96, 10));

    expect(result).toBe(false);
  });
});
