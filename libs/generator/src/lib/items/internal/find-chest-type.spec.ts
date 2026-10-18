import { MOON_MAGNET, RED_GEM, TRIPLE_STAR } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findChestType } from './find-chest-type';

describe('findChestType', () => {
  it('should name the type of the item when the pool holds it', () => {
    expect(findChestType(RED_GEM)).toBe('GEM');
    expect(findChestType(TRIPLE_STAR)).toBe('STAR');
    expect(findChestType(MOON_MAGNET)).toBe('GEAR');
  });

  it('should name no type when the pool does not hold the item', () => {
    expect(findChestType({ ...RED_GEM, id: 'UNKNOWN' })).toBeUndefined();
  });
});
