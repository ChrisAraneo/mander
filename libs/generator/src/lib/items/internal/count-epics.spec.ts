import { describe, expect, it } from 'vitest';

import { countEpics } from './count-epics';

describe('countEpics', () => {
  it('should count the epic rarities when some turn up', () => {
    expect(countEpics(['EPIC', 'COMMON', 'EPIC'])).toBe(2);
  });

  it('should count nothing when no epic turns up', () => {
    expect(countEpics(['COMMON', 'RARE'])).toBe(0);
  });

  it('should count nothing when there are no rarities', () => {
    expect(countEpics([])).toBe(0);
  });
});
