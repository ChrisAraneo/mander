import { describe, expect, it } from 'vitest';

import { formatLevelCategorySeed } from './format-level-category-seed';

describe('formatLevelCategorySeed', () => {
  it('should join the seed and the category in lower case', () => {
    expect(formatLevelCategorySeed('PROBE-SEED', 'HARD')).toBe(
      'PROBE-SEED#hard',
    );
  });

  it('should give another seed when the category is different', () => {
    expect(formatLevelCategorySeed('PROBE-SEED', 'NORMAL')).not.toBe(
      formatLevelCategorySeed('PROBE-SEED', 'VERTICAL'),
    );
  });
});
