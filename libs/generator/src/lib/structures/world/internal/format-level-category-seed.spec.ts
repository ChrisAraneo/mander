import { describe, expect, it } from 'vitest';

import { formatLevelCategorySeed } from './format-level-category-seed';

describe('formatLevelCategorySeed', () => {
  it('should join the seed and the category in lower case when it writes the seed', () => {
    expect(formatLevelCategorySeed('PROBE-SEED', 'HARD')).toBe(
      'PROBE-SEED#hard',
    );
  });

  it('should give the same seed when the seed and the category are the same', () => {
    expect(formatLevelCategorySeed('PROBE-SEED', 'HARD')).toBe(
      formatLevelCategorySeed('PROBE-SEED', 'HARD'),
    );
  });

  it('should give another seed when the category is different', () => {
    expect(formatLevelCategorySeed('PROBE-SEED', 'NORMAL')).not.toBe(
      formatLevelCategorySeed('PROBE-SEED', 'VERTICAL'),
    );
  });
});
