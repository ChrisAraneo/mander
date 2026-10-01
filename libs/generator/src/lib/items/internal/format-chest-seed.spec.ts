import { describe, expect, it } from 'vitest';

import { formatChestSeed } from './format-chest-seed';

describe('formatChestSeed', () => {
  it('should add the chest tag to the seed when it writes the seed', () => {
    expect(formatChestSeed('DAY-1')).toBe('DAY-1#chest');
  });

  it('should give the same seed when the seed is the same', () => {
    expect(formatChestSeed('DAY-1')).toBe(formatChestSeed('DAY-1'));
  });

  it('should give another seed when the seed is different', () => {
    expect(formatChestSeed('DAY-1')).not.toBe(formatChestSeed('DAY-2'));
  });
});
