import type { Enemy, EnemyKind } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeEnemyWobble } from './compute-enemy-wobble';

const createTestEnemy = (
  kind: EnemyKind,
  isGrounded: boolean,
  death: number | null,
): Enemy => ({
  kind,
  position: { x: 64, y: 96 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  timers: { death, reload: 0 },
  spawn: { x: 70, y: 96 },
  statuses: { isFacingRight: true, isGrounded },
});

describe('computeEnemyWobble', () => {
  it('should wobble the enemy by its spawn and the clock when it stands alive on the ground', () => {
    const result = computeEnemyWobble(
      createTestEnemy('HOPPING', true, null),
      false,
      0.5,
    );

    expect(result).toBeCloseTo(Math.sin(0.5 * 9 + 70 * 0.2) * 1.2, 6);
  });

  it('should not wobble the enemy when it is in the air', () => {
    const result = computeEnemyWobble(
      createTestEnemy('HOPPING', false, null),
      false,
      0.5,
    );

    expect(result).toBe(0);
  });

  it('should not wobble the enemy when it is dying', () => {
    const result = computeEnemyWobble(
      createTestEnemy('HOPPING', true, 0.1),
      true,
      0.5,
    );

    expect(result).toBe(0);
  });

  it('should not wobble the enemy when it is a beartrap', () => {
    const result = computeEnemyWobble(
      createTestEnemy('BEARTRAP', true, null),
      false,
      0.5,
    );

    expect(result).toBe(0);
  });
});
