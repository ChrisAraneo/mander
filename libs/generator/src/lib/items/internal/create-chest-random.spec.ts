import { createRandom } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { createChestRandom } from './create-chest-random';
import { formatChestSeed } from './format-chest-seed';

const rollFrom = (seed: string): number =>
  createChestRandom({ seed }).random.rollFloat();

describe('createChestRandom', () => {
  it('should roll the numbers of the chest seed when it starts the generator', () => {
    expect(rollFrom('DAY-1')).toBe(
      createRandom(formatChestSeed('DAY-1')).rollFloat(),
    );
  });

  it('should roll the same number when the seed is the same', () => {
    expect(rollFrom('DAY-1')).toBe(rollFrom('DAY-1'));
  });

  it('should roll another number when the seed is different', () => {
    expect(rollFrom('DAY-1')).not.toBe(rollFrom('DAY-2'));
  });

  it('should still roll when the seed is empty', () => {
    const roll = rollFrom('');

    expect(roll).toBeGreaterThanOrEqual(0);
    expect(roll).toBeLessThan(1);
  });
});
