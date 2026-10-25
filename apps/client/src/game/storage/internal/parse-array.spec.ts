import { describe, expect, it } from 'vitest';

import { parseArray } from './parse-array';

describe('parseArray', () => {
  it('should keep the list when the value is a list', () => {
    const list = [1, 'two'];

    expect(parseArray(list)).toBe(list);
  });

  it('should give an empty list when the value is not a list', () => {
    expect(parseArray({ length: 2 })).toEqual([]);
  });

  it('should give an empty list when the value is missing', () => {
    expect(parseArray(undefined)).toEqual([]);
  });
});
