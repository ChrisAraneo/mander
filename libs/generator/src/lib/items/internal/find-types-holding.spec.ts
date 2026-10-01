import { describe, expect, it } from 'vitest';

import { findTypesHolding } from './find-types-holding';

describe('findTypesHolding', () => {
  it('should keep the types that hold the rarity when some do', () => {
    expect(findTypesHolding(['GEAR', 'HEART'], 'RARE')).toEqual(['HEART']);
  });

  it('should fall back to every type left when none holds the rarity', () => {
    expect(findTypesHolding(['GEM', 'HEART'], 'EPIC')).toEqual([
      'GEM',
      'HEART',
    ]);
  });

  it('should give no types when no types are left', () => {
    expect(findTypesHolding([], 'COMMON')).toEqual([]);
  });
});
