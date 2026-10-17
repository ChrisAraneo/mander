import {
  BOOTS_OF_CLOUDS,
  HEART,
  type Item,
  STAR,
  TITANIUM_HELMET,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { canWard } from './can-ward';

const NO_EFFECT_ITEM: Item = { ...HEART, effect: { kind: 'NONE' } };

describe('canWard', () => {
  it('should ward off floor spikes when the item is the boots of clouds', () => {
    const isWarding = canWard(BOOTS_OF_CLOUDS, 'FLOOR_SPIKE');

    expect(isWarding).toBe(true);
  });

  it('should ward off ceiling spikes when the item is the titanium helmet', () => {
    const isWarding = canWard(TITANIUM_HELMET, 'CEILING_SPIKE');

    expect(isWarding).toBe(true);
  });

  it('should not ward off ceiling spikes when the item only wards off floor spikes', () => {
    const isWarding = canWard(BOOTS_OF_CLOUDS, 'CEILING_SPIKE');

    expect(isWarding).toBe(false);
  });

  it('should not ward off floor spikes when the item only wards off ceiling spikes', () => {
    const isWarding = canWard(TITANIUM_HELMET, 'FLOOR_SPIKE');

    expect(isWarding).toBe(false);
  });

  it('should not ward off spikes when the item gives a heart', () => {
    const isWarding = canWard(HEART, 'FLOOR_SPIKE');

    expect(isWarding).toBe(false);
  });

  it('should not ward off spikes when the item gives a star', () => {
    const isWarding = canWard(STAR, 'CEILING_SPIKE');

    expect(isWarding).toBe(false);
  });

  it('should not ward off spikes when the item has no effect', () => {
    const isWarding = canWard(NO_EFFECT_ITEM, 'FLOOR_SPIKE');

    expect(isWarding).toBe(false);
  });
});
