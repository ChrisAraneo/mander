import {
  BULLET,
  DOUBLE_HEART,
  HEART,
  type Item,
  STAR,
  TRIPLE_HEART,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeStartingHearts } from './compute-starting-hearts';
import { BASE_HEARTS } from './consts';

const createInventory = (): Item[] => [STAR, DOUBLE_HEART, BULLET];

describe('computeStartingHearts', () => {
  it('should add the hearts of every heart item to the base hearts when the inventory holds them', () => {
    const inventory = [HEART, DOUBLE_HEART, TRIPLE_HEART, HEART];

    const hearts = computeStartingHearts(inventory);

    expect(hearts).toBe(BASE_HEARTS + 7);
  });

  it('should count only the heart items when the inventory also holds other items', () => {
    const inventory = [STAR, DOUBLE_HEART, BULLET];

    const hearts = computeStartingHearts(inventory);

    expect(hearts).toBe(BASE_HEARTS + 2);
  });

  it('should not change the inventory it was given when it adds the hearts up', () => {
    const inventory = createInventory();

    computeStartingHearts(inventory);

    expect(inventory).toEqual(createInventory());
  });

  it('should give the base hearts when the inventory is empty', () => {
    const hearts = computeStartingHearts([]);

    expect(hearts).toBe(BASE_HEARTS);
  });
});
