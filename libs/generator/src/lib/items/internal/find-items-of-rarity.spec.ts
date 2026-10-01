import { HEART, TRIPLE_HEART } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findItemsOfRarity } from './find-items-of-rarity';

describe('findItemsOfRarity', () => {
  it('should keep the items of the rarity when some hold it', () => {
    expect(findItemsOfRarity([HEART, TRIPLE_HEART], HEART.rarity)).toEqual([
      HEART,
    ]);
  });

  it('should fall back to every item when none holds the rarity', () => {
    expect(findItemsOfRarity([HEART], 'EPIC')).toEqual([HEART]);
  });

  it('should give no items when there are none', () => {
    expect(findItemsOfRarity([], 'COMMON')).toEqual([]);
  });
});
