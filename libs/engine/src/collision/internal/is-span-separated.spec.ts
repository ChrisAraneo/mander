import { describe, expect, it } from 'vitest';

import { isSpanSeparated } from './is-span-separated';

describe('isSpanSeparated', () => {
  it('should be separated when the first span ends before the second begins', () => {
    const isSeparated = isSpanSeparated(
      { min: 0, max: 5 },
      { min: 8, max: 12 },
    );

    expect(isSeparated).toBe(true);
  });

  it('should be separated when the first span ends exactly where the second begins', () => {
    const isSeparated = isSpanSeparated(
      { min: 0, max: 8 },
      { min: 8, max: 12 },
    );

    expect(isSeparated).toBe(true);
  });

  it('should be separated when the first span begins exactly where the second ends', () => {
    const isSeparated = isSpanSeparated(
      { min: 12, max: 20 },
      { min: 8, max: 12 },
    );

    expect(isSeparated).toBe(true);
  });

  it('should be separated when the first span lies wholly after the second', () => {
    const isSeparated = isSpanSeparated(
      { min: 15, max: 20 },
      { min: 8, max: 12 },
    );

    expect(isSeparated).toBe(true);
  });

  it('should not be separated when the spans overlap', () => {
    const isSeparated = isSpanSeparated(
      { min: 0, max: 10 },
      { min: 8, max: 12 },
    );

    expect(isSeparated).toBe(false);
  });
});
