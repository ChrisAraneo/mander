import { describe, expect, it } from 'vitest';

import { getPrefix } from './get-prefix.ts';

describe('getPrefix', () => {
  it('should give the name prefix of each pool when it is asked for one', () => {
    expect(getPrefix('normal')).toBe('NORMAL');
    expect(getPrefix('hard')).toBe('HARD');
    expect(getPrefix('vertical')).toBe('VERTICAL');
  });
});
