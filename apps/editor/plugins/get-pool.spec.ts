import { describe, expect, it } from 'vitest';

import { getPool } from './get-pool.ts';

describe('getPool', () => {
  it('should give the pool the name starts with when it carries a known prefix', () => {
    expect(getPool('NORMAL_001')).toBe('normal');
    expect(getPool('HARD_012')).toBe('hard');
    expect(getPool('VERTICAL_3')).toBe('vertical');
  });

  it('should give no pool when the prefix is not followed by an underscore', () => {
    expect(getPool('NORMAL001')).toBeUndefined();
  });

  it('should give no pool when the name is empty', () => {
    expect(getPool('')).toBeUndefined();
  });
});
