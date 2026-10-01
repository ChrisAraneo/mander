import { MOON_MAGNET, RED_GEM, TRIPLE_STAR } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getChestType } from './get-chest-type';

describe('getChestType', () => {
  it('should name the type of the item when the pool holds it', () => {
    expect(getChestType(RED_GEM)).toBe('GEM');
    expect(getChestType(TRIPLE_STAR)).toBe('STAR');
    expect(getChestType(MOON_MAGNET)).toBe('GEAR');
  });

  it('should name no type when the pool does not hold the item', () => {
    expect(getChestType({ ...RED_GEM, id: 'UNKNOWN' })).toBeUndefined();
  });
});
