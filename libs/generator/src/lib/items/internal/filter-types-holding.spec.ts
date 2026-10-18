import { describe, expect, it } from 'vitest';

import { filterTypesHolding } from './filter-types-holding';

describe('filterTypesHolding', () => {
  it('should keep the types that hold the rarity when some do', () => {
    expect(filterTypesHolding(['GEAR', 'HEART'], 'RARE')).toEqual(['HEART']);
  });

  it('should fall back to every type left when none holds the rarity', () => {
    expect(filterTypesHolding(['GEM', 'HEART'], 'EPIC')).toEqual([
      'GEM',
      'HEART',
    ]);
  });

  it('should give no types when no types are left', () => {
    expect(filterTypesHolding([], 'COMMON')).toEqual([]);
  });
});
