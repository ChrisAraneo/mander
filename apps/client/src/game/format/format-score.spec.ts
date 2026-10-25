import { describe, expect, it } from 'vitest';

import { formatScore } from './format-score';

describe('formatScore', () => {
  it('should group the thousands when the score is large', () => {
    expect(formatScore(1234567)).toBe('1,234,567');
  });

  it('should show a plain zero when nothing has been scored', () => {
    expect(formatScore(0)).toBe('0');
  });
});
