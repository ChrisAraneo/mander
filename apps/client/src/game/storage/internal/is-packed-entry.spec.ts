import { describe, expect, it } from 'vitest';

import { isPackedEntry } from './is-packed-entry';

describe('isPackedEntry', () => {
  it('should accept the entry when it is a list of numbers', () => {
    expect(isPackedEntry([0, 1, 2])).toBe(true);
  });

  it('should refuse the entry when it holds something other than a number', () => {
    expect(isPackedEntry([0, '1'])).toBe(false);
  });

  it('should refuse the entry when it holds a number that is not finite', () => {
    expect(isPackedEntry([Infinity])).toBe(false);
  });

  it('should refuse the entry when it is not a list', () => {
    expect(isPackedEntry({ 0: 1 })).toBe(false);
  });

  it('should accept the entry when the list is empty', () => {
    expect(isPackedEntry([])).toBe(true);
  });
});
