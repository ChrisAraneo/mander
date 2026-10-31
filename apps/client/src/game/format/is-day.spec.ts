import { describe, expect, it } from 'vitest';

import { isDay } from './is-day';
import { serializeDay } from './serialize-day';

describe('isDay', () => {
  it('should take the day when it is written as a year, a month and a day', () => {
    expect(isDay('2026-01-01')).toBe(true);
    expect(isDay('2026-12-31')).toBe(true);
  });

  it('should take the day when it was written by the game itself', () => {
    expect(isDay(serializeDay(new Date('2026-09-04T10:00:00Z')))).toBe(true);
  });

  it('should turn the day away when it is empty', () => {
    expect(isDay('')).toBe(false);
  });

  it('should turn the day away when it is not written as a plain day', () => {
    expect(isDay('2026-09-04T10:00:00Z')).toBe(false);
    expect(isDay('04/09/2026')).toBe(false);
    expect(isDay('tomorrow')).toBe(false);
  });

  it('should turn the day away when the month or the day is left short', () => {
    expect(isDay('2026-1-1')).toBe(false);
  });

  it('should turn the day away when there is no such day on the calendar', () => {
    expect(isDay('2026-02-30')).toBe(false);
    expect(isDay('2026-13-01')).toBe(false);
  });

  it('should take the day when the year is a leap one and the day is its extra one', () => {
    expect(isDay('2028-02-29')).toBe(true);
    expect(isDay('2026-02-29')).toBe(false);
  });
});
