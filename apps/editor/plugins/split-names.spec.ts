import { describe, expect, it } from 'vitest';

import { splitNames } from './split-names.ts';

describe('splitNames', () => {
  it('should give each name once trimmed when the list spans several lines', () => {
    expect(splitNames('\n  DR,\n  __,\n')).toEqual(['DR', '__']);
  });

  it('should leave out the names that are commented out when the list parks some', () => {
    expect(splitNames('\n  DR,\n  // CN,\n  __,\n')).toEqual(['DR', '__']);
  });

  it('should give no names when the list is empty', () => {
    expect(splitNames('  ')).toEqual([]);
  });
});
