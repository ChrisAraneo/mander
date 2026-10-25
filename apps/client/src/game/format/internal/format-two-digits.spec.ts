import { describe, expect, it } from 'vitest';

import { formatTwoDigits } from './format-two-digits';

describe('formatTwoDigits', () => {
  it('should put a zero in front when the number has one digit', () => {
    expect(formatTwoDigits(4)).toBe('04');
  });

  it('should keep the number as it is when it already has two digits', () => {
    expect(formatTwoDigits(12)).toBe('12');
  });

  it('should give two zeros when the number is zero', () => {
    expect(formatTwoDigits(0)).toBe('00');
  });
});
