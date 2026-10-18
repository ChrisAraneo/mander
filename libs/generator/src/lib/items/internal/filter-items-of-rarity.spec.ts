import { HEART, TRIPLE_HEART } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { filterItemsOfRarity } from './filter-items-of-rarity';

describe('filterItemsOfRarity', () => {
  it('should keep the items of the rarity when some hold it', () => {
    expect(filterItemsOfRarity([HEART, TRIPLE_HEART], HEART.rarity)).toEqual([
      HEART,
    ]);
  });

  it('should fall back to every item when none holds the rarity', () => {
    expect(filterItemsOfRarity([HEART], 'RARE')).toEqual([HEART]);
  });

  it('should give no items when there are none', () => {
    expect(filterItemsOfRarity([], 'COMMON')).toEqual([]);
  });
});
