import { describe, expect, it } from 'vitest';

import { formatSpan } from './format-span';

describe('formatSpan', () => {
  it('should join the first and last column with a dash when given several columns', () => {
    expect(formatSpan([8, 9, 10, 11])).toBe('8-11');
  });

  it('should repeat the column when given one column', () => {
    expect(formatSpan([9])).toBe('9-9');
  });

  it('should show undefined on both sides when given no columns', () => {
    expect(formatSpan([])).toBe('undefined-undefined');
  });
});
