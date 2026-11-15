import { HEART, type Item, RED_GEM, STAR, TWO_BULLETS } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeStartingStars } from './compute-starting-stars';

const TRIPLE_STAR_AMOUNT = 3;

const TRIPLE_STAR: Item = {
  ...STAR,
  effect: { kind: 'STAR', amount: TRIPLE_STAR_AMOUNT },
};

const NO_EFFECT_ITEM: Item = {
  ...STAR,
  effect: { kind: 'NONE' },
};

const createInventory = (): Item[] => [TWO_BULLETS, STAR, TWO_BULLETS];

describe('computeStartingStars', () => {
  it('should count one star when the inventory holds one star item', () => {
    const stars = computeStartingStars([STAR]);

    expect(stars).toBe(1);
  });

  it('should add up the stars of every star item when the inventory holds several', () => {
    const stars = computeStartingStars([STAR, TRIPLE_STAR, STAR]);

    expect(stars).toBe(5);
  });

  it('should leave out the other items when the inventory mixes them with stars', () => {
    const stars = computeStartingStars([TWO_BULLETS, STAR, TWO_BULLETS]);

    expect(stars).toBe(1);
  });

  it('should count no stars when the inventory holds no star item', () => {
    const stars = computeStartingStars([TWO_BULLETS]);

    expect(stars).toBe(0);
  });

  it('should count no stars when the inventory holds a heart item', () => {
    const stars = computeStartingStars([HEART]);

    expect(stars).toBe(0);
  });

  it('should count no stars when the inventory holds a score item', () => {
    const stars = computeStartingStars([RED_GEM]);

    expect(stars).toBe(0);
  });

  it('should count no stars when the item carries no effect', () => {
    const stars = computeStartingStars([NO_EFFECT_ITEM]);

    expect(stars).toBe(0);
  });

  it('should not change the inventory it was given when it adds the stars up', () => {
    const inventory = createInventory();

    computeStartingStars(inventory);

    expect(inventory).toEqual(createInventory());
  });

  it('should count no stars when the inventory is empty', () => {
    const stars = computeStartingStars([]);

    expect(stars).toBe(0);
  });
});
