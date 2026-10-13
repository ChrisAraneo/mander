import { describe, expect, it } from 'vitest';

import { countOccurrences } from './count-occurrences';

describe('countOccurrences', () => {
  it('should count how many times the category shows up when it shows up more than once', () => {
    expect(
      countOccurrences(['NORMAL', 'VERTICAL', 'NORMAL', 'HARD'], 'NORMAL'),
    ).toBe(2);
  });

  it('should count nothing when the category does not show up', () => {
    expect(countOccurrences(['NORMAL', 'HARD'], 'VERTICAL')).toBe(0);
  });

  it('should count nothing when there are no categories', () => {
    expect(countOccurrences([], 'NORMAL')).toBe(0);
  });
});
