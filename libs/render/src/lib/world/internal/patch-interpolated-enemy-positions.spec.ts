import type { Enemy } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchInterpolatedEnemyPositions } from './patch-interpolated-enemy-positions';

const createTestEnemy = (spawnX: number, positionX: number): Enemy => ({
  kind: 'HOPPING',
  position: { x: positionX, y: 32 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  timers: { death: null },
  spawn: { x: spawnX, y: 32 },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('patchInterpolatedEnemyPositions', () => {
  it('should move each enemy part of the way when it is found in the previous frame', () => {
    const result = patchInterpolatedEnemyPositions(
      [createTestEnemy(64, 10)],
      [createTestEnemy(64, 20)],
      0.5,
    );

    expect(result).toEqual([
      { ...createTestEnemy(64, 20), position: { x: 15, y: 32 } },
    ]);
  });

  it('should leave an enemy as it is when it is not in the previous frame', () => {
    const result = patchInterpolatedEnemyPositions(
      [createTestEnemy(64, 10)],
      [createTestEnemy(96, 20)],
      0.5,
    );

    expect(result).toEqual([createTestEnemy(96, 20)]);
  });

  it('should give no enemies when there are none', () => {
    const result = patchInterpolatedEnemyPositions([], [], 0.5);

    expect(result).toEqual([]);
  });
});
