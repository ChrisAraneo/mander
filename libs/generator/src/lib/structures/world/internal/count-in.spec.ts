import { describe, expect, it } from 'vitest';

import { countIn } from './count-in';

describe('countIn', () => {
  it('should count how many times the category shows up', () => {
    expect(countIn(['NORMAL', 'VERTICAL', 'NORMAL', 'HARD'], 'NORMAL')).toBe(2);
  });

  it('should count nothing when the category does not show up', () => {
    expect(countIn(['NORMAL', 'HARD'], 'VERTICAL')).toBe(0);
  });

  it('should count nothing when there are no categories', () => {
    expect(countIn([], 'NORMAL')).toBe(0);
  });
});
