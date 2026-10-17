import { BOOTS_OF_CLOUDS, HEART, STAR, TITANIUM_HELMET } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isWarded } from './is-warded';

describe('isWarded', () => {
  it('should be warded when one of the items wards off the spikes', () => {
    const isSafe = isWarded([HEART, BOOTS_OF_CLOUDS, STAR], 'FLOOR_SPIKE');

    expect(isSafe).toBe(true);
  });

  it('should not be warded when no item wards off the spikes', () => {
    const isSafe = isWarded([HEART, TITANIUM_HELMET, STAR], 'FLOOR_SPIKE');

    expect(isSafe).toBe(false);
  });

  it('should not be warded when the inventory is empty', () => {
    const isSafe = isWarded([], 'CEILING_SPIKE');

    expect(isSafe).toBe(false);
  });
});
