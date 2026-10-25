import { describe, expect, it } from 'vitest';

import { getType } from './get-type.ts';

describe('getType', () => {
  it('should give the plain structure type when the pool is a horizontal one', () => {
    expect(getType('normal')).toBe('Structure');
    expect(getType('hard')).toBe('Structure');
  });

  it('should give the vertical structure type when the pool is the vertical one', () => {
    expect(getType('vertical')).toBe('VerticalStructure');
  });
});
