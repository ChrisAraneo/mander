import { describe, expect, it } from 'vitest';

import { serializeDay } from './serialize-day';

describe('serializeDay', () => {
  it('should write the day as year, month and day when it is given a date', () => {
    expect(serializeDay(new Date('2026-09-04T10:00:00Z'))).toBe('2026-09-04');
  });

  it('should take the day in universal time when the local clock is on another day', () => {
    expect(serializeDay(new Date('2026-12-31T23:59:59Z'))).toBe('2026-12-31');
  });

  it('should pad the month and the day when they are single digits', () => {
    expect(serializeDay(new Date('2026-01-02T00:00:00Z'))).toBe('2026-01-02');
  });
});
