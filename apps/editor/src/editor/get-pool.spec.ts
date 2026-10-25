import { describe, expect, it } from 'vitest';

import { getPool } from './get-pool';

describe('getPool', () => {
  it('should give the pool the name starts with when it carries a known prefix', () => {
    expect(getPool('HARD_001')).toBe('hard');
    expect(getPool('VERTICAL_001')).toBe('vertical');
    expect(getPool('NORMAL_001')).toBe('normal');
  });

  it('should fall back to the normal pool when the name has no known prefix', () => {
    expect(getPool('EASY_001')).toBe('normal');
    expect(getPool('')).toBe('normal');
  });
});
