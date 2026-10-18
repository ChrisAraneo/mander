import { type Item, STAR, TWO_BULLETS } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { countStartingStars } from './count-starting-stars';

const TRIPLE_STAR: Item = {
  ...STAR,
  effect: { kind: 'STAR', amount: 3 },
};

describe('countStartingStars', () => {
  it('should count one star when the inventory holds one star item', () => {
    const stars = countStartingStars([STAR]);

    expect(stars).toBe(1);
  });

  it('should add up the stars of every star item when the inventory holds several', () => {
    const stars = countStartingStars([STAR, TRIPLE_STAR, STAR]);

    expect(stars).toBe(5);
  });

  it('should leave out the other items when the inventory mixes them with stars', () => {
    const stars = countStartingStars([TWO_BULLETS, STAR, TWO_BULLETS]);

    expect(stars).toBe(1);
  });

  it('should count no stars when the inventory holds no star item', () => {
    const stars = countStartingStars([TWO_BULLETS]);

    expect(stars).toBe(0);
  });

  it('should count no stars when the inventory is empty', () => {
    const stars = countStartingStars([]);

    expect(stars).toBe(0);
  });
});
