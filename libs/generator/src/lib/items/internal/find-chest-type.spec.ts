import { FOUR_BULLETS, RED_GEM, TRIPLE_STAR } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findChestType } from './find-chest-type';

describe('findChestType', () => {
  it('should name the type of the item when the pool holds it', () => {
    expect(findChestType(RED_GEM)).toBe('GEM');
    expect(findChestType(TRIPLE_STAR)).toBe('STAR');
    expect(findChestType(FOUR_BULLETS)).toBe('BULLET');
  });

  it('should name no type when the pool does not hold the item', () => {
    expect(findChestType({ ...RED_GEM, id: 'UNKNOWN' })).toBeUndefined();
  });
});
