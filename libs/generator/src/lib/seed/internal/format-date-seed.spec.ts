import { describe, expect, it } from 'vitest';

import { formatDateSeed } from './format-date-seed';

describe('formatDateSeed', () => {
  it('should write the year, the month and the day when it is given a date', () => {
    expect(formatDateSeed(new Date(Date.UTC(2026, 10, 24)))).toBe('2026-11-24');
  });

  it('should pad the month and the day to two digits when they are below ten', () => {
    expect(formatDateSeed(new Date(Date.UTC(2026, 0, 5)))).toBe('2026-01-05');
  });

  it('should read the date in UTC when the time is late in the day', () => {
    expect(formatDateSeed(new Date(Date.UTC(2026, 0, 5, 23, 59)))).toBe(
      '2026-01-05',
    );
  });
});
