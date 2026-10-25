import { describe, expect, it } from 'vitest';

import { formatClock } from './format-clock';

describe('formatClock', () => {
  it('should show minutes and padded seconds when the time runs past a minute', () => {
    expect(formatClock(65)).toBe('1:05');
  });

  it('should drop the fraction of a second when the time is not whole', () => {
    expect(formatClock(59.9)).toBe('0:59');
  });

  it('should show zero when no time has passed', () => {
    expect(formatClock(0)).toBe('0:00');
  });

  it('should show zero when the time is below zero', () => {
    expect(formatClock(-3)).toBe('0:00');
  });
});
