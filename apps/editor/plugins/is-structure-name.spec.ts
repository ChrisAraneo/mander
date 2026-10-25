import { describe, expect, it } from 'vitest';

import { isStructureName } from './is-structure-name.ts';

describe('isStructureName', () => {
  it('should accept the name when it is a pool prefix and at least three digits', () => {
    expect(isStructureName('NORMAL_001')).toBe(true);
    expect(isStructureName('HARD_1234')).toBe(true);
    expect(isStructureName('VERTICAL_050')).toBe(true);
  });

  it('should turn the name away when it has fewer than three digits', () => {
    expect(isStructureName('NORMAL_5')).toBe(false);
  });

  it('should turn the name away when the prefix is unknown or anything trails the digits', () => {
    expect(isStructureName('EASY_001')).toBe(false);
    expect(isStructureName('NORMAL_001;')).toBe(false);
    expect(isStructureName('')).toBe(false);
  });
});
