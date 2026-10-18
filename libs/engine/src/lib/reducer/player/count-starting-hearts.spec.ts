import { BULLET, DOUBLE_HEART, HEART, STAR, TRIPLE_HEART } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { BASE_HEARTS } from './consts';
import { countStartingHearts } from './count-starting-hearts';

describe('countStartingHearts', () => {
  it('should add the hearts of every heart item to the base hearts when the inventory holds them', () => {
    const inventory = [HEART, DOUBLE_HEART, TRIPLE_HEART, HEART];

    const hearts = countStartingHearts(inventory);

    expect(hearts).toBe(BASE_HEARTS + 7);
  });

  it('should count only the heart items when the inventory also holds other items', () => {
    const inventory = [STAR, DOUBLE_HEART, BULLET];

    const hearts = countStartingHearts(inventory);

    expect(hearts).toBe(BASE_HEARTS + 2);
  });

  it('should give the base hearts when the inventory is empty', () => {
    const hearts = countStartingHearts([]);

    expect(hearts).toBe(BASE_HEARTS);
  });
});
