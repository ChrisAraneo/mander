import { describe, expect, it } from 'vitest';

import { computeEnemySquash } from './compute-enemy-squash';

describe('computeEnemySquash', () => {
  it('should keep the enemy its full height when dying has not begun', () => {
    const result = computeEnemySquash(0);

    expect(result).toBe(1);
  });

  it('should squash the enemy down to the floor share when dying is over', () => {
    const result = computeEnemySquash(1);

    expect(result).toBeCloseTo(0.15, 6);
  });

  it('should squash the enemy part of the way when dying is half over', () => {
    const result = computeEnemySquash(0.5);

    expect(result).toBeCloseTo(0.575, 6);
  });
});
